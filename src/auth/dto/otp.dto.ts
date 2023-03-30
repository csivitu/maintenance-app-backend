import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class OtpDto {
  @IsUUID(4)
  otpId: string;

  @IsNumber()
  @Min(100000)
  @Max(999999)
  otp: number;
}
