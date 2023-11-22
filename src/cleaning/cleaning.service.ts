import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignJobDto } from './dto/assignJob.dto';
import { Role } from '@prisma/client';
import { CustomError } from './interface/cleaning.interface';

@Injectable()
export class CleaningService {
  constructor(readonly prismaService: PrismaService) {}

  /**
   * @description Creates a new cleaning job for a room
   * @date 11/21/2023 - 9:47:56 AM
   *
   * @async
   * @param {number} roomId - The id of the room
   * @param {Date} time - The time of the job
   */
  async newJob(roomId: number, time: Date, issuedById: number) {
    if (!roomId || !time) {
      throw new InternalServerErrorException([
        'Invalid Request',
        'Invalid Room ID or Time',
      ]);
    }
    const ongoingJob = await this.prismaService.cleaningJob.findFirst({
      where: { Room: { id: roomId }, completed: false },
      select: { id: true, time: true },
    });

    if (ongoingJob) {
      return { ...ongoingJob, newJob: false };
    }

    try {
      const newJob = await this.prismaService.cleaningJob.create({
        data: {
          time,
          Room: { connect: { id: roomId } },
          issuedBy: { connect: { id: issuedById } },
        },
        select: { id: true, time: true },
      });
      return { ...newJob, newJob: true };
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Retrieves a list of cleaners based on the block of a staff member
   * @date 11/21/2023 - 10:47:56 AM
   *
   * @async
   * @param {number} id - The ID of the staff member
   */
  async getCleaners(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      return await this.prismaService.staff.findMany({
        where: { role: Role.cleaner, block },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Retrieves a list of non-assigned cleaning jobs for a specific block
   *
   * @async
   * @param {number} id - The ID of the staff member
   */
  async getNonAssignedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      const nonAssignedJobs = await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, Staff: null, completed: false },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
        },
        orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
      });

      return nonAssignedJobs;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Retrieves a list of assigned cleaning jobs for a specific block
   * @date 11/21/2023 - 1:47:56 PM
   *
   * @async
   * @param {number} id - The ID of the staff member
   */
  async getAssignedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      const assignedJobs = await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, completed: false, NOT: { Staff: null } },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
          Staff: { select: { name: true } },
        },
        orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
      });

      return assignedJobs.map(
        ({ id, time, Room: { number, block }, Staff }) => ({
          id,
          time,
          room: {
            number,
            block,
          },
          staff: Staff ? Staff.name : 'Not Assigned',
        }),
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Retrieves a list of completed cleaning jobs for a specific block
   * @async
   * @param {number} id - The ID of the staff member
   */
  async getCompletedJobs(id: number) {
    try {
      const { block } = await this.prismaService.staff.findUniqueOrThrow({
        where: { id },
        select: { block: true },
      });

      const response = await this.prismaService.cleaningJob.findMany({
        where: { Room: { block }, completed: true },
        select: {
          id: true,
          time: true,
          Room: { select: { number: true, block: true } },
          Staff: { select: { name: true } },
        },
        orderBy: [{ time: 'desc' }, { createdAt: 'desc' }],
      });
      return response.map(({ id, time, Room: { number, block }, Staff }) => ({
        id,
        time,
        room: {
          number,
          block,
        },
        staff: Staff ? Staff.name : 'Not Assigned',
      }));
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Assigns a cleaning job to a staff member
   *
   * @async
   * @param {number} id - The ID of the cleaning job
   * @param {AssignJobDto} assignJobDto - Data Transfer Object containing the job and staff IDs   */
  async assignJob(id: number, assignJobDto: AssignJobDto) {
    const { jobId, staffId } = assignJobDto;
    try {
      const updatedJob = await this.prismaService.cleaningJob.update({
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
      return updatedJob;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Marks a cleaning job as completed
   * @date 11/21/2023 - 4:47:56 PM
   *
   * @async
   * @param {number} roomId - The ID of the room
   * @param {number} jobId - The ID of the cleaning job
   * @param {number} confirmedById - The ID of the student who confirmed the job
   * @returns {Promise<string>} - Returns a promise that resolves to a string indicating the job status
   */
  async completeJob(
    roomId: number,
    jobId: number,
    confirmedById: number,
  ): Promise<string | void> {
    try {
      await this.prismaService.cleaningJob.update({
        where: { id: jobId },
        data: {
          completed: true,
          confirmedBy: { connect: { id: confirmedById } },
        },
      });

      return 'Completed';
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * @description Retrieves the status of a cleaning job for a specific room
   *
   * @async
   * @param {number} userRoomId - The ID of the room
   */
  async getStatus(userRoomId: number) {
    try {
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
      this.handleError(error);
    }
  }

  /**
   * @description Handles errors throughout the application
   * @date 11/21/2023 - 11:47:56 AM
   *
   * @param {CustomError} error - The error that was thrown
   * @throws {UnauthorizedException|InternalServerErrorException} - Throws an exception based on the error type
   */
  private handleError(error: CustomError) {
    switch (error.name) {
      case 'NotFoundError':
        throw new UnauthorizedException(['Invalid Token']);
      case 'PrismaClientKnownRequestError':
        throw new InternalServerErrorException([
          `Database Error: ClientKnownRequestError`,
          `Error Code: ${error.code}`,
        ]);
      case 'PrismaClientUnknownRequestError':
        throw new InternalServerErrorException([
          `Unknown Database Error: Unknown Request Error`,
          `Error: ${error}`,
        ]);
      default:
        throw new InternalServerErrorException([`Pizdec`, `Error: ${error}`]);
    }
  }
}
