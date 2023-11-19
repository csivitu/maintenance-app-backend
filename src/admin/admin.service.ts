import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getDate, getEndDate, getStartDate } from 'src/utils/helper';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number) {
    try {
      const user = await this.prismaService.staff.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors here
        throw new InternalServerErrorException([
          `Database Error: ${error.message}`,
          `Error Code: ${error.code}`,
        ]);
      } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors here
        throw new InternalServerErrorException([
          `Unknown Database Error: ${error.message}`,
          `Error: ${error}`,
        ]);
      } else {
        // Fallback error handling
        throw new InternalServerErrorException([
          `Unexpected Error: ${error.message}`,
          `Error: ${error}`,
        ]);
      }
    }
  }
  async adminHomePage(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      // need to calculate
      // total number of cleaning jobs today
      const totalCleaningJobsToday = await this.prismaService.cleaningJob.count(
        {
          where: {
            AND: [
              {
                Room: {
                  block,
                },
              },
              { time: { gte: getStartDate() } },
              { time: { lte: getEndDate() } },
            ],
          },
        },
      );
      // total number of cleaning jobs assinged today
      const totalCleaningJobsAssingedToday =
        await this.prismaService.cleaningJob.count({
          where: {
            AND: [
              {
                Room: {
                  block,
                },
              },
              { time: { gte: getStartDate() } },
              { time: { lte: getEndDate() } },
              { assigned: true },
            ],
          },
        });

      // Need to get the total number of jobs vs cleaned jobs for the last 7 days
      // total jobs for the last 7 days
      const totalCleaningJobsForTheLast7Days =
        await this.prismaService.cleaningJob.findMany({
          where: {
            AND: [
              {
                Room: {
                  block,
                },
              },
              { time: { gte: getDate(7) } },
              { time: { lte: getEndDate() } },
            ],
          },
        });
      // create a loop and for create an dict where each key is the date and the value is the number of jobs
      const totalJobsForTheLast7Days: {
        [key: string]: { total: number; cleaned: number };
      } = {};
      for (let i = 0; i < totalCleaningJobsForTheLast7Days.length; i++) {
        const date = totalCleaningJobsForTheLast7Days[i].time.toDateString();
        if (totalJobsForTheLast7Days[date]) {
          totalJobsForTheLast7Days[date].total += 1;
        } else {
          totalJobsForTheLast7Days[date] = { total: 1, cleaned: 0 };
        }
        if (totalCleaningJobsForTheLast7Days[i].completed) {
          totalJobsForTheLast7Days[date].cleaned += 1;
        }
      }
      return {
        totalCleaningJobsToday,
        totalCleaningJobsAssingedToday,
        totalJobsForTheLast7Days,
      };
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException(['Invalid Token']);
      }
      throw error;
    }
  }
}
