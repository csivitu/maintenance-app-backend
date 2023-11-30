import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { IsFutureDate } from 'src/validator/isFutureDate.validator';

export class CleaningJobDto {
  @ApiProperty({ default: new Date() })
  @IsDateString()
  @IsFutureDate({ message: 'time must be a future date' })
  //! TODO: Need to add another decorator to check for slots
  time: Date;
}
