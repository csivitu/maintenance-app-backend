import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { OtpDto } from './dto/otp.dto';
import { RefreshDto } from './dto/refrest.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email);
  }

  @Post('staff-login')
  async staffLogin(@Body() loginDto: LoginDto) {
    return await this.authService.staffLogin(loginDto.email);
  }

  @Post('otp')
  async verifyOtp(@Body() otpDto: OtpDto) {
    return await this.authService.verifyOtp(otpDto.otpId, otpDto.otp);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto.refreshToken);
  }
}
