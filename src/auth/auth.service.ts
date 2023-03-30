import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { generateOtp } from './helpers/generateOtp.helper';
import { randomInt, randomUUID } from 'crypto';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async login(email: string) {
    const user = await this.prisma.student.findUniqueOrThrow({
      where: { email },
      select: { id: true, roomId: true },
    });

    const otp = randomInt(100000, 1000000);
    const otpId = randomUUID();

    this.cacheManager.set(otpId, { otp, user }, 60 * 5);
    return { otpId, otp };
  }
}
