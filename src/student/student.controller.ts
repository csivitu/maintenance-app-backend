import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { StudentService } from './student.service';
import { User } from '../auth/auth.decorator';
import { UserInterface } from 'src/auth/interface/user.interface';
import { CleaningJobDto } from './dto/cleaningJob.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Student')
@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async getStudents(@User() user: UserInterface) {
    return await this.studentService.getStudents(user.id);
  }

  @Post('cleaning')
  async cleaning(
    @User() user: UserInterface,
    @Body() cleaningJobDto: CleaningJobDto,
  ) {
    return await this.studentService.cleaning(user.roomId, cleaningJobDto.time);
  }
}
