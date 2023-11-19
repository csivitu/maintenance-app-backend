import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'nilaynath.sharan2021@vitstudent.ac.in' })
  @IsEmail()
  email: string;
}
