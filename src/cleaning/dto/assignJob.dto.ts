import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignJobDto {
  @ApiProperty()
  @IsNumber()
  jobId: number;

  @ApiProperty()
  @IsNumber()
  staffId: number;
}
