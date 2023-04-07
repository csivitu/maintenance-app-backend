import { ApiProperty } from '@nestjs/swagger';

class OtpSuccessfulInterface {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

class InvalidOtpInterface {
  @ApiProperty({ default: 'Invalid OTP' })
  message: string;

  @ApiProperty({ default: 'Unauthorized' })
  error: string;

  @ApiProperty({ default: 401 })
  statusCode: number;
}

class BadOtpRequestInterface {
  @ApiProperty({
    default: ['Error Message'],
  })
  message: Array<string>;

  @ApiProperty({ default: 'Bad Request' })
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export const OtpSuccessfulResponse = {
  description: 'Otp Successful',
  type: OtpSuccessfulInterface,
  status: 201,
};

export const InvalidOtpResponse = {
  description: 'Invalid Otp',
  type: InvalidOtpInterface,
  status: 401,
};

export const BadOtpRequestResponse = {
  description: 'Invalid OTP Format',
  type: BadOtpRequestInterface,
  status: 400,
};
