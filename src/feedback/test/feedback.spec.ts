import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from '../feedback.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  // TODO: Add more tests here
});
