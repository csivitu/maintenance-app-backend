import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignJobDto } from './dto/assignJob.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CleaningService {
  constructor(private readonly prismaService: PrismaService) {}

  //* a room can only have one ongoing cleaning job at a time
  //* check if there is an ongoing job for the room
  //* if yes then return the job with old job true!
  //* if no then create a new job for the room and return it to the users with new job false
  // ! add better error handling
  async newJob(roomId: number, time: Date) {
    try {
      const ongoingJob = await this.prismaService.cleaningJob.findFirst({
        where: { Room: { id: roomId }, completed: false },
        select: { id: true, time: true },
      });
      if (ongoingJob) return { ...ongoingJob, newJob: false };
      const newJob = await this.prismaService.cleaningJob.create({
        data: { time, Room: { connect: { id: roomId } } },
        select: { id: true, time: true },
      });
      if (!newJob) throw new Error('Failed to create new job');
      return { ...newJob, newJob: true };
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
        throw new UnauthorizedException(['Invalid Token']);
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
        throw new UnauthorizedException(['Invalid Token']);
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
        throw new UnauthorizedException(['Invalid Token']);
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
        throw new UnauthorizedException(['Invalid Token']);
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
  async getStatus(userRoomId: number) {
    try {
      // check if the user has a room
      if (!userRoomId || typeof userRoomId !== 'number') {
        throw new BadRequestException([`Invalid Room ID`]);
      }

      // check if the user has an ongoing job
      const ongoingJob = await this.prismaService.cleaningJob.findFirst({
        where: { Room: { id: userRoomId }, completed: false },
        select: {
          id: true,
          time: true,
          Staff: { select: { name: true } },
        },
      });

      if (ongoingJob) {
        return {
          status: true,
          jobId: ongoingJob.id,
          time: ongoingJob.time,
          staff: ongoingJob.Staff ? ongoingJob.Staff.name : 'Not Assigned',
        };
      } else {
        return {
          status: false,
          jobId: null,
          time: null,
          staff: 'Not Assigned',
        };
      }
    } catch (error) {
      // Return a response status
      return {
        status: 500,
        message: [
          `Error getting status for room ${userRoomId}: ${error.message}`,
          `error: ${error}`,
        ],
      };
    }
  }
}
