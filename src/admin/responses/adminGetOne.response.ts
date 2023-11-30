import { applyDecorators } from '@nestjs/common';
import {
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

class Staff {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: Role;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  block: string;
  @ApiProperty()
  CleaningJobs: [];
}
const findOneSuccessResponse = {
  description: 'Get a user by id',
  type: Staff,
  status: 200,
};

const NotFoundExceptionResponse = {
  description: 'User not found',
  status: 404,
};

const InternalServerErrorResponse = {
  description: 'Internal server error',
  status: 500,
};

export const adminfindOneDoc = () => {
  return applyDecorators(
    ApiResponse(findOneSuccessResponse),
    ApiBadRequestResponse(NotFoundExceptionResponse),
    ApiInternalServerErrorResponse(InternalServerErrorResponse),
  );
};
