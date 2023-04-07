import { ApiProperty } from '@nestjs/swagger';


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

export const BadStaffLoginRequestResponse = {
  description: 'Not Staff Mal',
  type: BadRequestInterface,
  status: 400,
};
