import { ApiProperty } from '@nestjs/swagger';

class LoginSuccessfulInterface {
  @ApiProperty()
  otpId: string;
}

class InvalidEmailInterface {
  @ApiProperty({ default: 'Invalid Email' })
  message: string;

  @ApiProperty({ default: 'Unauthorized' })
  error: string;

  @ApiProperty({ default: 401 })
  statusCode: number;
}

class BadRequestInterface {
  @ApiProperty({
    default: [
      'Invalid email address format. Only Vit Student Email addresses allowed are allowed.',
    ],
  })
  message: Array<string>;

  @ApiProperty({ default: 'Bad Request' })
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export const LoginSuccessfulResponse = {
  description: 'Login Successful',
  type: LoginSuccessfulInterface,
  status: 201,
};

export const InvalidEmailResponse = {
  description: 'Invalid Email',
  type: InvalidEmailInterface,
  status: 401,
};

export const BadLoginRequestResponse = {
  description: 'Not Vit Mail',
  type: BadRequestInterface,
  status: 400,
};
