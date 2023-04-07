import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/otp.dto';
import { RefreshDto } from './dto/refrest.dto';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadLoginRequestResponse,
  InvalidEmailResponse,
  LoginSuccessfulResponse,
} from './responses/login.response';
import { BadStaffLoginRequestResponse } from './responses/staffLogin.response';
import {
  BadOtpRequestResponse,
  InvalidOtpResponse,
  OtpSuccessfulResponse,
} from './responses/otp.response';
import {
  BadRefreshRequestResponse,
  InvalidRefreshTokenResponse,
  RefreshSuccessfulResponse,
} from './responses/refresh.response';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse(LoginSuccessfulResponse)
  @ApiResponse(InvalidEmailResponse)
  @ApiBadRequestResponse(BadLoginRequestResponse)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, 'student');
  }
  @ApiResponse(LoginSuccessfulResponse)
  @ApiResponse(InvalidEmailResponse)
  @ApiBadRequestResponse(BadStaffLoginRequestResponse)
  @Post('staff-login')
  async staffLogin(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, 'staff');
  }

  @ApiResponse(OtpSuccessfulResponse)
  @ApiResponse(InvalidOtpResponse)
  @ApiBadRequestResponse(BadOtpRequestResponse)
  @Post('otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto.otpId, otpDto.otp);
  }

  @ApiResponse(RefreshSuccessfulResponse)
  @ApiResponse(InvalidRefreshTokenResponse)
  @ApiBadRequestResponse(BadRefreshRequestResponse)
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto.refreshToken);
  }
}
