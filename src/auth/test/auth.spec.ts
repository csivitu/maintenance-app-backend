/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { CACHE_MANAGER, UnauthorizedException } from '@nestjs/common';
import { Staff, Student } from '@prisma/client';

//* Service
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              findUniqueOrThrow: jest.fn(),
            },
            staff: {
              findUniqueOrThrow: jest.fn(),
            },
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
        { provide: JwtService, useValue: {} },
        {
          provide: MailService,
          useValue: {
            sendUsersOtp: jest.fn(),
          },
        },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //* ------ Login ------
  it('should login a user', async () => {
    // Arrange
    const email = 'test@vitstudent.ac.in';
    const userType = 'student';

    // Mock the dependencies
    jest.spyOn(service.prisma.student, 'findUniqueOrThrow').mockResolvedValue({
      id: 123,
      roomId: 465,
      name: 'John Doe',
      email: email,
    } as Student);

    // Act
    const result = await service.login(email, userType);
    // Assert
    expect(result).toEqual(expect.objectContaining({ userType: 'student' }));
  });

  it('should login a staff', async () => {
    // Arrange
    const email = 'test@gmail.com';
    const userType = 'staff';

    // Mock the dependencies
    jest.spyOn(service.prisma.staff, 'findUniqueOrThrow').mockResolvedValue({
      id: 123,
      name: 'John Doe',
      email: email,
    } as Staff);

    // Act
    const result = await service.login(email, userType);
    // Assert
    expect(result).toEqual(expect.objectContaining({ userType: 'staff' }));
  });

  //* --- Verify OTP ---
  it('should verify OTP and return tokens', async () => {
    // Arrange
    const otpId = '1234';
    const otpNew = 123456;
    const user = { id: '123', roomId: '456' };
    const otpObject = { otp: otpNew, user };
    const tokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    // Mock the dependencies
    jest.spyOn(service.cacheManager, 'get').mockResolvedValue(otpObject);
    jest.spyOn(service, 'generateToken').mockResolvedValue(tokens);

    // Act
    const result = await service.verifyOtp(otpId, otpNew);

    // Assert
    expect(result).toEqual(tokens);
  });
  it('should throw UnauthorizedException if OTP ID is invalid', async () => {
    // Arrange
    const otpId = 'invalid-id';
    const otpNew = 123456;

    // Mock the dependencies
    jest.spyOn(service.cacheManager, 'get').mockResolvedValue(undefined);

    // Assert
    await expect(service.verifyOtp(otpId, otpNew)).rejects.toThrow(
      UnauthorizedException,
    );
  });
  it('should throw UnauthorizedException if OTP is invalid', async () => {
    // Arrange
    const otpId = '1234';
    const otpNew = 123456; // Invalid OTP
    const user = { id: '123', roomId: '456' };
    const otpObject = { otp: 654321, user }; // Correct OTP is 654321

    // Mock the dependencies
    jest.spyOn(service.cacheManager, 'get').mockResolvedValue(otpObject);

    // Assert
    await expect(service.verifyOtp(otpId, otpNew)).rejects.toThrow(
      UnauthorizedException,
    );
  });
  it('should refresh token and return new tokens', async () => {
    // Arrange
    const refreshToken = 'refresh-token';
    const user = { id: '123', roomId: '456' };
    const tokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    // Mock the dependencies
    jest.spyOn(service.cacheManager, 'get').mockResolvedValue(user);
    jest.spyOn(service, 'generateToken').mockResolvedValue(tokens);

    // Act
    const result = await service.refresh(refreshToken);

    // Assert
    expect(result).toEqual(tokens);
  });

  it('should throw UnauthorizedException if refresh token is invalid', async () => {
    // Arrange
    const refreshToken = 'invalid-token';

    // Mock the dependencies
    jest.spyOn(service.cacheManager, 'get').mockResolvedValue(undefined);

    // Assert
    await expect(service.refresh(refreshToken)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

//* Controller
describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const authModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockImplementation((_email, userType) => {
              return Promise.resolve({ otpId: '1234', userType });
            }),
            verifyOtp: jest.fn().mockImplementation((_otpId, _otpNew) => {
              return Promise.resolve({
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
              });
            }),
            refresh: jest.fn().mockImplementation((_refreshToken) => {
              return Promise.resolve({
                accessToken: 'new-access-token',
                refreshToken: 'new-refresh-token',
              });
            }),
          },
        },
      ],
    }).compile();

    authController = authModule.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login a user', async () => {
    const result = await authController.login({
      email: 'test@vitstudent.ac.in',
    });
    expect(result).toEqual({ otpId: '1234', userType: 'student' });
  });

  it('should login a staff', async () => {
    const result = await authController.login({
      email: 'test@gmail.com',
    });
    expect(result).toEqual({ otpId: '1234', userType: 'staff' });
  });

  it('should verify OTP', async () => {
    const result = await authController.verifyOtp({
      otpId: '1234',
      otp: 123456,
    });
    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should refresh token', async () => {
    const result = await authController.refresh({
      refreshToken: 'refresh-token',
    });
    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });
});
