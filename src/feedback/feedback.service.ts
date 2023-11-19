import { Injectable, NotFoundException } from '@nestjs/common';
import { JobType } from '@prisma/client';
import { CreateFeedbackDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFeedbackDto: CreateFeedbackDto, studentId: number) {
    const createFeedback = await this.prismaService.feedBack.create({
      data: {
        ...createFeedbackDto,
        studentId,
      },
    });
    return createFeedback;
  }

  async findAll() {
    try {
      const data = await this.prismaService.feedBack.findMany();
      return data;
    } catch (error) {
      throw new NotFoundException(['No feedback found']);
    }
  }

  async findFeedbackByRole(Job: JobType) {
    try {
      return await this.prismaService.feedBack.findMany({
        where: {
          Job,
        },
      });
    } catch (error) {
      throw new NotFoundException(['No feedback found']);
    }
  }

  async findFeedbackByStudent(id: number) {
    try {
      return await this.prismaService.feedBack.findMany({
        where: {
          studentId: id,
        },
      });
    } catch (error) {
      throw new NotFoundException(['No feedback found']);
    }
  }
}
