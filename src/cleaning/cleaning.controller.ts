import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { CleaningJobDto } from 'src/student/dto/cleaningJob.dto';
import { JwtGuard } from '../auth/auth.guard';
import { CleaningService } from './cleaning.service';
import { AssignJobDto } from './dto/assignJob.dto';
import { CompleteJobDto } from './dto/completeJob.dto';

@ApiBearerAuth()
@ApiTags('Cleaning')
@UseGuards(JwtGuard)
@Controller('cleaning')
export class CleaningController {
  constructor(private readonly cleaningService: CleaningService) {}

  @Post('new-job')
  async newJob(
    @User() user: UserInterface,
    @Body() cleaningJobDto: CleaningJobDto,
  ) {
    return await this.cleaningService.newJob(user.roomId, cleaningJobDto.time);
  }

  @Get('cleaners')
  async getCleaners(@User() user: UserInterface) {
    return await this.cleaningService.getCleaners(user.id);
  }

  @Get('non-assigned-jobs')
  async getNonAssignedJobs(@User() user: UserInterface) {
    return await this.cleaningService.getNonAssignedJobs(user.id);
  }

  @Get('assigned-jobs')
  async getAssignedJobs(@User() user: UserInterface) {
    return await this.cleaningService.getAssignedJobs(user.id);
  }

  @Get('completed-jobs')
  async getCompletedJobs(@User() user: UserInterface) {
    return await this.cleaningService.getCompletedJobs(user.id);
  }

  @Post('assign-job')
  async assignJob(@User() user: UserInterface, @Body() assignJobDto: AssignJobDto) {
    return await this.cleaningService.assignJob(user.id, assignJobDto);
  }

  @Post('complete-job')
  async completeJob(@User() user: UserInterface, @Body() completeJobDto: CompleteJobDto) {
    return await this.cleaningService.completeJob(user.roomId, completeJobDto.jobId);
  }
}