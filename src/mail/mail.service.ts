import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUsersOtp(email: string, otp: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP',
      template: './otp',
      context: {
        otp,
      },
    });
  }
}
