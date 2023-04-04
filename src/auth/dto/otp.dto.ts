import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class OtpDto {
  @ApiProperty()
  @IsUUID(4)
  otpId: string;

  @ApiProperty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  otp: number;
}
