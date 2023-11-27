import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JobType, Prisma } from '@prisma/client';
import { CreateFeedbackDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomError } from 'src/cleaning/interface/cleaning.interface';

@Injectable()
export class FeedbackService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createFeedbackDto: CreateFeedbackDto, studentId: number) {
    try {
      const createFeedback = await this.prismaService.feedBack.create({
        data: {
          ...createFeedbackDto,
          studentId,
        },
      });
      return createFeedback;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  async findAll() {
    try {
      const data = await this.prismaService.feedBack.findMany();
      return data;
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  /**
   * Handles errors thrown by Prisma.
   * @param error - The error thrown by Prisma.
   * @throws {ConflictException} - If a unique constraint would be violated.
   * @throws {NotFoundException} - If no student is found.
   * @throws {InternalServerErrorException} - If an unknown database error occurs.
   * @throws {InternalServerErrorException} - If the database client could not be initialized.
   * @throws {InternalServerErrorException} - If the database engine crashed.
   * @throws {Error} - If an unknown error occurs.
   */
  handleError(error: CustomError) {
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
