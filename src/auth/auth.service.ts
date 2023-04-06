import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomInt, randomUUID } from 'crypto';
import { Cache } from 'cache-manager';
import { otpCache } from './interface/otpCache.interface';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from './interface/user.interface';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, userType: string) {
    try {
      let user: UserInterface;
      if (userType === 'student') {
        user = await this.prisma.student.findUniqueOrThrow({
          where: { email },
          select: { id: true, roomId: true },
        });
      } else {
        user = await this.prisma.staff.findUniqueOrThrow({
          where: { email },
          select: { id: true, role: true },
        });
      }
      const otp = randomInt(100000, 1000000); // 6 digit otp
      const otpId = randomUUID();

      this.mailService.sendUsersOtp(email, otp);

      this.cacheManager.set(otpId, { otp, user }, 1000 * 60 * 5); // set for 5 minutes
      return { otpId };
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Email');
      }
      throw error;
    }
  }

  async verifyOtp(otpId: string, otpNew: number) {
    const otpObject = <otpCache>await this.cacheManager.get(otpId);
    if (otpObject === undefined) {
      throw new UnauthorizedException('Invalid OTP ID');
    }
    const { otp, user } = otpObject;
    if (otpNew === otp) {
      this.cacheManager.del(otpId);
      const { accessToken, refreshToken } = await this.generateToken(user);
      this.cacheManager.set(refreshToken, user, 1000 * 60 * 60 * 24 * 30); // set for 30 days
      return { accessToken, refreshToken };
    }
    throw new UnauthorizedException('Invalid OTP');
  }

  async refresh(refreshToken: string) {
    const user = <UserInterface>await this.cacheManager.get(refreshToken);
    if (user === undefined) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    this.cacheManager.del(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateToken(user);
    this.cacheManager.set(newRefreshToken, user, 60 * 60 * 24 * 30 * 1000); // set for 30 days
    return { accessToken, refreshToken: newRefreshToken };
  }

  async generateToken(user: UserInterface) {
    const accessToken = this.jwtService.sign(user, {
      expiresIn: await this.configService.get('ACCESS_TOKEN_EXPIRY'),
      secret: await this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    const refreshToken = this.jwtService.sign(user, {
      expiresIn: await this.configService.get('REFRESH_TOKEN_EXPIRY'),
      secret: await this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}
