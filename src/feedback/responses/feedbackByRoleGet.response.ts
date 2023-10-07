import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { feedBackResponseInterface } from '.';

const feedBackByJobGetSuccessResponse = {
  description: 'Get all feedbacks by job',
  type: feedBackResponseInterface,
  status: 201,
};

const NotFoundExceptionResponse = {
  description: 'No feedback found',
  status: 404,
};

export const feedbackByJobGetDoc = () => {
  return applyDecorators(
    ApiResponse(feedBackByJobGetSuccessResponse),
    ApiBadRequestResponse(NotFoundExceptionResponse),
  );
};
