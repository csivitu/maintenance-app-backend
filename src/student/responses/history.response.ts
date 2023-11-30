import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

export class CleaningJobResponseInterface {
  @ApiProperty()
  time: string;

  @ApiProperty()
  Room: {
    number: number;
    block: string;
  };

  @ApiProperty()
  Staff: boolean;

  @ApiProperty()
  completed: boolean;
}

const cleaningJobGetSuccessResponse = {
  description: 'Get student cleaning jobs history',
  type: CleaningJobResponseInterface,
  status: 201,
};

const NotFoundExceptionResponse = {
  description: 'No cleaning jobs found for this student',
  status: 404,
};

export const cleaningJobGetDoc = () => {
  return applyDecorators(
    ApiResponse(cleaningJobGetSuccessResponse),
    ApiBadRequestResponse(NotFoundExceptionResponse),
  );
};
