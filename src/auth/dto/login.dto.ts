import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'kaushalvishnu.rathi2021@vitstudent.ac.in' })
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@vitstudent\.ac\.in$/, {
    message:
      'Invalid email address format. Only Vit Student Email addresses allowed are allowed.',
  })
  email: string;
}
