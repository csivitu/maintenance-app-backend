import { FeedBack } from '@prisma/client';

interface studentDataType {
  name: string;
  FeedBack: FeedBack[];
  Room: {
    number: number;
    Student: {
      name: string;
    }[];
    block: string;
    CleaningJobs: CleaningJob[];
  };
}

interface cleaningJobType {
  time: Date;
  block: string;
  room: {
    number: number;
    block: string;
  };
  staff: string;
}
