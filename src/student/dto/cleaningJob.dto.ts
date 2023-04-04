import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CleaningJobDto {
  @ApiProperty()
  @IsDateString() 
  time: Date;
}
