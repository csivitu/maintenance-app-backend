import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { JobType } from '@prisma/client';

export class feedBackResponseInterface {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  studentId: number;

  @ApiProperty()
  Job: JobType;
}

const feedBackGetSuccessResponse = {
  description: 'Get all feedbacks',
  type: feedBackResponseInterface,
  status: 201,
};

const NotFoundExceptionResponse = {
  description: 'No feedback found',
  status: 404,
};

export const feedbackGetDoc = () => {
  return applyDecorators(
    ApiResponse(feedBackGetSuccessResponse),
    ApiBadRequestResponse(NotFoundExceptionResponse),
  );
};
