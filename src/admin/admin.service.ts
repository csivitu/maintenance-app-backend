import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getStartDate, getEndDate, getDate } from './utils/helper';

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

  //! Need to optimize it
  async adminHomePage(id: number) {
    try {
      const { block, name } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true, name: true },
      });
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
              { time: { gte: getDate(6) } },
              { time: { lte: getEndDate() } },
            ],
          },
        });
      const graphDataForTheLast7Days: {
        total: number;
        cleaned: number;
        date: string;
      }[] = [];
      for (let i = 0; i < totalCleaningJobsForTheLast7Days.length; i++) {
        const date = totalCleaningJobsForTheLast7Days[i].time.toDateString();
        const index = graphDataForTheLast7Days.findIndex(
          (item) => item.date === date,
        );
        if (index === -1) {
          graphDataForTheLast7Days.push({
            total: 1,
            cleaned: totalCleaningJobsForTheLast7Days[i].completed ? 1 : 0,
            date,
          });
        } else {
          graphDataForTheLast7Days[index].total += 1;
          if (totalCleaningJobsForTheLast7Days[i].completed) {
            graphDataForTheLast7Days[index].cleaned += 1;
          }
        }
      }
      // need to add another check to see if there is any missing date
      // if there is a missing date then add it to the graphDataForTheLast7Days array and make the values zero
      if (graphDataForTheLast7Days.length < 7) {
        const missingDates = [];
        for (let i = 0; i < 7; i++) {
          const date = getDate(i).toDateString();
          const index = graphDataForTheLast7Days.findIndex(
            (item) => item.date === date,
          );
          if (index === -1) {
            missingDates.push(date);
          }
        }
        for (let i = 0; i < missingDates.length; i++) {
          graphDataForTheLast7Days.push({
            total: 0,
            cleaned: 0,
            date: missingDates[i],
          });
        }
      }
      // need to sort the graphDataForTheLast7Days array by date
      graphDataForTheLast7Days.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      // convert the date to day
      graphDataForTheLast7Days.map((item) => {
        item.date = new Date(item.date).toLocaleDateString('en-GB', {
          weekday: 'short',
        });
      });
      // find the maximum number of cleaned jobs & total jobs for the last 7 days
      const maxCleanedJobsInTheLast7Days = Math.max(
        ...graphDataForTheLast7Days.map((item) => item.cleaned),
      );
      const maxTotalJobsInTheLast7Days = Math.max(
        ...graphDataForTheLast7Days.map((item) => item.total),
      );
      return {
        name,
        totalCleaningJobsToday,
        totalCleaningJobsAssingedToday,
        maxCleanedJobsInTheLast7Days,
        maxTotalJobsInTheLast7Days,
        graphDataForTheLast7Days,
      };
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException(['Invalid Token']);
      }
      throw error;
    }
  }
}
