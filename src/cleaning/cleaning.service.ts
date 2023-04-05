import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      where: { Room: { block }, Staff: null },
      select: { id: true, time: true, Room: { select: { number: true } } },
      orderBy: { time: 'asc', createdAt: 'asc' },
    });
  }
}
