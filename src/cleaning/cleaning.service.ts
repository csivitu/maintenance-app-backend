import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignJobDto } from './dto/assignJob.dto';

@Injectable()
export class CleaningService {
  constructor(private readonly prismaService: PrismaService) {}

  async newJob(roomId: number, time: Date) {
    return await this.prismaService.cleaningJob.create({
      data: { time, Room: { connect: { id: roomId } } },
      select: { id: true, time: true },
    });
  }

  async getCleaners(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      return await this.prismaService.staff.findMany({
        where: { role: 'cleaner', block },
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }

  async getNonAssignedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      return await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, Staff: null, completed: false },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
        },
        orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }

  async getAssignedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });
      return await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, completed: false, NOT: { Staff: null } },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
          Staff: { select: { name: true } },
        },
        orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }

  async getCompletedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      return await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, completed: true },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
          Staff: { select: { name: true } },
        },
        orderBy: [{ time: 'desc' }, { createdAt: 'desc' }],
      });
    } catch (error) {
      if (error.name == 'NotFoundError') {
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }

  async assignJob(id: number, assignJobDto: AssignJobDto) {
    const { jobId, staffId } = assignJobDto;
    return await this.prismaService.cleaningJob.update({
      where: { id: jobId },
      data: { Staff: { connect: { id: staffId } } },
      select: {
        id: true,
        time: true,
        Room: { select: { number: true, block: true } },
        Staff: { select: { name: true } },
        assigned: true,
      },
    });
  }

  async completeJob(roomId: number, jobId: number) {
    await this.prismaService.cleaningJob.updateMany({
      where: { id: jobId, Room: { id: roomId } },
      data: { completed: true },
    });

    return 'Completed';
  }
}
