import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { JobType } from '@prisma/client';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { CreateFeedbackDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { feedbackByJobGetDoc, feedbackGetDoc } from './responses';

@ApiBearerAuth()
@ApiTags('Feedback')
@UseGuards(JwtGuard)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('new-feedback')
  create(
    @Body() createFeedbackDto: CreateFeedbackDto,
    @User() user: UserInterface,
  ) {
    return this.feedbackService.create(createFeedbackDto, user.id);
  }

  @feedbackGetDoc()
  @Get('all-feedback')
  findAll() {
    return this.feedbackService.findAll();
  }

  @feedbackByJobGetDoc()
  @Get('feedback-by-role/:Job')
  findFeedbackByRole(@Param('Job') Job: JobType) {
    return this.feedbackService.findFeedbackByRole(Job);
  }

  @Get('feedback-by-student')
  findFeedbackByStudent(@User() user: UserInterface) {
    return this.feedbackService.findFeedbackByStudent(user.id);
  }
}
