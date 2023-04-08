import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';

class StudentInterface {
  @ApiProperty()
  name: number;
}

class CleaningJobInterface {
  @ApiProperty()
  id: number;
  @ApiProperty()
  time: string;
  @ApiProperty()
  assigned: boolean;
  @ApiProperty()
  completed: boolean;
}

class RoomInterface {
  @ApiProperty()
  number: number;
  @ApiProperty()
  block: string;

  @ApiProperty({ type: StudentInterface, isArray: true })
  Student: StudentInterface[];

  @ApiProperty({ type: CleaningJobInterface, isArray: true})
  CleaningJobs: CleaningJobInterface[];
}

class StudentSuccessfulInterface {
  @ApiProperty()
  name: string;
  @ApiProperty()
  Room: RoomInterface;
}

export const StudentSuccessfulResponse = {
  description: 'Student Successful',
  type: StudentSuccessfulInterface,
  status: 200,
};
