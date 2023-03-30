import { IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@vitstudent\.ac\.in$/, {
    message:
      'Invalid email address format. Only Vit Student Email addresses allowed are allowed.',
  })
  email: string;
}
