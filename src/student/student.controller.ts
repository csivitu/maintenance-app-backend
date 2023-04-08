import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/auth.guard';
import { StudentService } from './student.service';
import { User } from '../auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { CleaningJobDto } from './dto/cleaningJob.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentModule } from './student.module';
import { StudentSuccessfulResponse } from './responses/student.response';

@ApiBearerAuth()
@ApiTags('Student')
@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiResponse(StudentSuccessfulResponse)
  @Get()
  async getStudents(@User() user: UserInterface) {
    return await this.studentService.getStudents(user.id);
  }
}
