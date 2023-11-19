import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import {
  BadLoginRequestResponse,
  InvalidEmailResponse,
  LoginSuccessfulResponse,
} from './login.response';
import {
  OtpSuccessfulResponse,
  InvalidOtpResponse,
  BadOtpRequestResponse,
} from './otp.response';
import {
  RefreshSuccessfulResponse,
  InvalidRefreshTokenResponse,
  BadRefreshRequestResponse,
} from './refresh.response';

export const loginResponseDoc = () => {
  return applyDecorators(
    ApiResponse(LoginSuccessfulResponse),
    ApiResponse(InvalidEmailResponse),
    ApiBadRequestResponse(BadLoginRequestResponse),
  );
};

export const otpResponseDoc = () => {
  return applyDecorators(
    ApiResponse(OtpSuccessfulResponse),
    ApiResponse(InvalidOtpResponse),
    ApiBadRequestResponse(BadOtpRequestResponse),
  );
};

export const refreshResponseDoc = () => {
  return applyDecorators(
    ApiResponse(RefreshSuccessfulResponse),
    ApiResponse(InvalidRefreshTokenResponse),
    ApiBadRequestResponse(BadRefreshRequestResponse),
  );
};
