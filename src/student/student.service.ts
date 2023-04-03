import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prismaService: PrismaService) {}
  async getStudents(id: number) {
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
      },
    });
  }

  async cleaning(roomId: number, time: Date) {
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
