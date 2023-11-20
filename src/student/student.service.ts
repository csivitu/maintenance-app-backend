import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { cleaningJobType, studentDataType } from './interface/student.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   *@async getStudent
   * @description returns the student with the given id
   * @param {number} id the id of the student
   * @returns {Promise<studentDataType | null>} the student with the given id
   */
  async getStudent(id: number): Promise<studentDataType | null> {
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
      this.handleError(error);
      return null;
    }
  }
  /**
   * @async getStudentCleaningJobsHistory
   * @description returns the cleaning jobs history of the student with the given id
   * @param {number} id the id of the student
   * @returns {Promise<cleaningJobType[] | null>} the cleaning jobs history of the student with the given id
   */
  async getStudentCleaningJobsHistory(
    id: number,
  ): Promise<cleaningJobType[] | null> {
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
      this.handleError(error);
      return null;
    }
  }

  /**
   * Fetches the names of the roommates of a student.
   *
   * @param {number} id - The ID of the student.
   * @returns {Promise<string[]>} - A promise that resolves to an array of names of the roommates.
   * @throws {Error} - If an error occurs while fetching the data.
   */
  async getRoomates(id: number): Promise<string[]> {
    try {
      const student = await this.prismaService.student.findUniqueOrThrow({
        where: { id },
        include: {
          Room: {
            include: {
              Student: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      // Map the roommates to their names
      return student.Room.Student.map((roommate) => roommate.name);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  // * needs to return the status of the cleaning job
  async getStatus(id: number) {
    return `This is the status of the student with id ${id}`;
  }

  handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(
            'A unique constraint would be violated on Student. Details: ' +
              error.meta?.cause,
          );
        case 'P2025':
          throw new NotFoundException('No Student found');
        default:
          throw new InternalServerErrorException('Unknown database error');
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new InternalServerErrorException('Unknown database error');
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new InternalServerErrorException(
        'Could not initialize database client',
      );
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new InternalServerErrorException('Database engine crashed');
    } else {
      throw error;
    }
  }
}
