import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/otp.dto';
import { RefreshDto } from './dto/refrest.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  loginResponseDoc,
  otpResponseDoc,
  refreshResponseDoc,
} from './responses';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @loginResponseDoc()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    if (!loginDto.email.endsWith('@vitstudent.ac.in')) {
      return await this.authService.login(loginDto.email, 'staff');
    }
    return await this.authService.login(loginDto.email, 'student');
  }

  @otpResponseDoc()
  @Post('otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto.otpId, otpDto.otp);
  }

  @refreshResponseDoc()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto.refreshToken);
  }
}
