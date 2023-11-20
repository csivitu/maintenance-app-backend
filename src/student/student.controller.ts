import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/auth.guard';
import { StudentService } from './student.service';
import { User } from '../auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentSuccessfulResponse, cleaningJobGetDoc } from './responses';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiBearerAuth()
@ApiTags('Student')
@UseGuards(JwtGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiResponse(StudentSuccessfulResponse)
  @SetMetadata('roles', ['student'])
  @UseGuards(RolesGuard)
  @Get()
  async getStudent(@User() user: UserInterface) {
    return await this.studentService.getStudent(user.id);
  }

  @cleaningJobGetDoc()
  @SetMetadata('roles', ['student'])
  @UseGuards(RolesGuard)
  @Get(`cleaning-jobs-history`)
  async getStudentCleaningJobsHistory(@User() user: UserInterface) {
    return await this.studentService.getStudentCleaningJobsHistory(user.id);
  }

  @SetMetadata('roles', ['student'])
  @UseGuards(RolesGuard)
  @Get(`roomates`)
  async getRoomates(@User() user: UserInterface) {
    return await this.studentService.getRoomates(user.id);
  }

  @SetMetadata('roles', ['student'])
  @UseGuards(RolesGuard)
  @Get(`status`)
  async getStatus(@User() user: UserInterface) {
    return await this.studentService.getStatus(user.id);
  }
}
