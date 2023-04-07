import { ApiProperty } from '@nestjs/swagger';

class RefreshSuccessfulInterface {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

class InvalidRefreshTokenInterface {
  @ApiProperty({ default: 'Invalid refresh token' })
  message: string;

  @ApiProperty({ default: 'Unauthorized' })
  error: string;

  @ApiProperty({ default: 401 })
  statusCode: number;
}

class BadRefreshRequestInterface {
  @ApiProperty({
    default: ['refreshToken must be a jwt string'],
  })
  message: Array<string>;

  @ApiProperty({ default: 'Bad Request' })
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export const RefreshSuccessfulResponse = {
  description: 'Refresh Successful',
  type: RefreshSuccessfulInterface,
  status: 201,
};

export const InvalidRefreshTokenResponse = {
  description: 'Invalid Refresh Token',
  type: InvalidRefreshTokenInterface,
  status: 401,
};

export const BadRefreshRequestResponse = {
  description: 'Invalid Refresh Token Format',
  type: BadRefreshRequestInterface,
  status: 400,
};

