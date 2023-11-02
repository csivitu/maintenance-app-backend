import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}
  async getStudent(id: number | undefined) {
    try {
      return await this.prismaService.student.findUniqueOrThrow({
        where: { id },
        select: {
          name: true,
          Room: {
            select: {
              number: true,
              block: true,
              Student: {
                select: {
                  name: true,
                },
              },
              CleaningJobs: true,
            },
          },
          FeedBack: true,
        },
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException(['Invalid Token']);
      }
      throw error;
    }
  }

  async getStudentCleaningJobsHistory(id: number) {
    try {
      const roomId = await this.prismaService.student.findUniqueOrThrow({
        where: { id },
        select: {
          Room: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!roomId) {
        throw new NotFoundException(['Student not found']);
      }

      const cleaningJobs = await this.prismaService.cleaningJob.findMany({
        where: {
          roomId: roomId.Room.id,
        },
        select: {
          time: true,
          Room: {
            select: {
              number: true,
              block: true,
            },
          },
          Staff: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!cleaningJobs || cleaningJobs.length === 0) {
        throw new NotFoundException([
          'No cleaning jobs found for this student',
        ]);
      }

      return cleaningJobs.map((cleaningJob) => {
        return {
          time: cleaningJob.time,
          block: cleaningJob.Room.block,
          room: {
            number: cleaningJob.Room.number,
            block: cleaningJob.Room.block,
          },
          staff: cleaningJob.Staff ? cleaningJob.Staff.name : 'Not assigned',
        };
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }
  async getRoomates(id: number) {
    try {
      const roomId = await this.prismaService.student.findUniqueOrThrow({
        where: { id },
        select: {
          Room: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!roomId) {
        throw new NotFoundException(['Student not found']);
      }

      const roomates = await this.prismaService.student.findMany({
        where: {
          roomId: roomId.Room.id,
        },
        select: {
          name: true,
        },
      });

      if (!roomates || roomates.length === 0) {
        throw new NotFoundException(['No roomates found for this student']);
      }
      return roomates.map((roomate) => roomate.name);
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException(['Invalid Token']);
      }
      throw error;
    }
  }
  // * needs to return the status of the cleaning job
  async getStatus(id: number) {
    return `This is the status of the student with id ${id}`;
  }
}
