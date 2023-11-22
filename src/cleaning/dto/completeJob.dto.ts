import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CompleteJobDto {
  @ApiProperty()
  @IsNumber()
  jobId: number;
}
