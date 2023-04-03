import { IsDateString } from 'class-validator';

export class CleaningJobDto {
  @IsDateString() //generate datestring for testing
  time: Date;
}
