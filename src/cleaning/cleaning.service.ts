import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CleaningService {
  constructor(private readonly prismaService: PrismaService) {}

  async newJob(roomId: number, time: Date) {
    return await this.prismaService.cleaningJob.create({
      data: {
        time,
        Room: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }
}
