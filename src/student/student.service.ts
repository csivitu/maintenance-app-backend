import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        throw new UnauthorizedException('Invalid Token');
      }
      throw error;
    }
  }

  async getStudentCleaningJobsHistory(id: number | undefined) {
    return `This action returns a #${id} student cleaning jobs history`;
  }
}
