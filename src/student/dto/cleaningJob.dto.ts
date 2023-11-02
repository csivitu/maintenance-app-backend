import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CleaningJobDto {
  @ApiProperty({ default: '2021-04-01T09:30:00.000Z' })
  @IsDateString()
  // @Matches(/^\d{4}-\d{2}-\d{2}T(09:(30|45)|1[0-7]:(00|15|30|45)):00.000Z$/, {
  //   message:
  //     'Time Not Available. Please select a time between 9:30 AM and 5:45 PM in 15 minute intervals.',
  // })
  time: Date;
}
