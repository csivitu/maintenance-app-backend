import { ApiProperty } from '@nestjs/swagger';
import { JobType } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ default: 'Horrible app sucks dick' })
  @IsString()
  message: string;
  @ApiProperty({ default: 'cleaning' })
  @IsNotEmpty()
  Job: JobType;
}
