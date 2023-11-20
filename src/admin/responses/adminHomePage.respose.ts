import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

class AdminHomePage {
  @ApiProperty()
  name: string;
  @ApiProperty()
  totalCleaningJobsToday: number;
  @ApiProperty()
  maxCleanedJobsInTheLast7Days: number;
  @ApiProperty()
  maxTotalJobsInTheLast7Days: number;
  @ApiProperty()
  totalCleaningJobsAssingedToday: number;
  @ApiProperty()
  graphDataForTheLast7Days: [];
}

const adminHomePageSuccessResponse = {
  description: 'Get admin home page data',
  type: AdminHomePage,
  status: 200,
};

const InternalServerErrorResponse = {
  description: 'Internal server error',
  status: 500,
};

const UnauthorizedExceptionResponse = {
  description: 'Unauthorized',
  status: 401,
};

export const adminHomePageDoc = () => {
  return applyDecorators(
    ApiResponse(adminHomePageSuccessResponse),
    ApiInternalServerErrorResponse(InternalServerErrorResponse),
    ApiUnauthorizedResponse(UnauthorizedExceptionResponse),
  );
};
