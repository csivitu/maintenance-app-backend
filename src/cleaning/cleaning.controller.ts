import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { CleaningJobDto } from 'src/student/dto/cleaningJob.dto';
import { JwtGuard } from '../auth/auth.guard';
import { CleaningService } from './cleaning.service';


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
}
