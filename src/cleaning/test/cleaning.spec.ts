import { Test, TestingModule } from '@nestjs/testing';
import { CleaningService } from '../cleaning.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CleaningService', () => {
  let cleaningService: CleaningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningService,
        {
          provide: PrismaService,
          useValue: {
            cleaningJob: {
              findUniqueOrThrow: jest.fn(),
            },
            staff: {
              findUniqueOrThrow: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    cleaningService = module.get<CleaningService>(CleaningService);
  });

  it('should be defined', () => {
    expect(cleaningService).toBeDefined();
  });
});
