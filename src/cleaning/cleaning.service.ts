import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignJobDto } from './dto/assignJob.dto';

@Injectable()
export class CleaningService {
  constructor(private readonly prismaService: PrismaService) {}

  async newJob(roomId: number, time: Date) {
    return await this.prismaService.cleaningJob.create({
      data: { time, Room: { connect: { id: roomId } } },
    });
  }

  async getCleaners(id: number) {
    const { block } = await this.prismaService.staff.findUniqueOrThrow({
      where: { id },
      select: { block: true },
    });

    return await this.prismaService.staff.findMany({
      where: { role: 'cleaner', block },
      select: { id: true, name: true },
    });
  }

  async getNonAssignedJobs(id: number) {
    const { block } = await this.prismaService.staff.findUniqueOrThrow({
      where: { id },
      select: { block: true },
    });

    return await this.prismaService.cleaningJob.findMany({
      where: { Room: { block }, Staff: null, completed: false },
      select: { id: true, time: true, Room: { select: { number: true } } },
      orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getAssignedJobs(id: number) {
    const { block } = await this.prismaService.staff.findUniqueOrThrow({
      where: { id },
      select: { block: true },
    });

    return await this.prismaService.cleaningJob.findMany({
      where: { Room: { block }, completed: false, NOT: { Staff: null } },
      select: {
        id: true,
        time: true,
        Room: { select: { number: true } },
        Staff: { select: { name: true } },
      },
      orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async getCompletedJobs(id: number) {
    const { block } = await this.prismaService.staff.findUniqueOrThrow({
      where: { id },
      select: { block: true },
    });

    return await this.prismaService.cleaningJob.findMany({
      where: { Room: { block }, completed: true },
      select: {
        id: true,
        time: true,
        Room: { select: { number: true } },
        Staff: { select: { name: true } },
      },
      orderBy: [{ time: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async assignJob(id: number, assignJobDto: AssignJobDto) {
    const { jobId, staffId } = assignJobDto;

    return await this.prismaService.cleaningJob.update({
      where: { id: jobId },
      data: { Staff: { connect: { id: staffId } } },
    });
  }

  async completeJob(roomId: number, jobId: number) {
    return await this.prismaService.cleaningJob.updateMany({
      where: { id: jobId, Room: { id: roomId } },
      data: { completed: true },
    });
  }
}
