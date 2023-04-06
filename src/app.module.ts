import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { CleaningModule } from './cleaning/cleaning.module';

@Module({
  imports: [
    AuthModule,
    // CacheModule.registerAsync({
    //   useFactory: async () => {
    //     return {
    //       store: await redisStore({
    //         ttl: 60 * 1 * 1000,
    //         socket: {
    //           host: 'localhost',
    //           port: 6379,
    //         },
    //       }),
    //       isGlobal: true,
    //     };
    //   },
    // }),
    CacheModule.register({
      store: redisStore,
      ttl: 60 * 1 * 1000,
      socket: {
        host: 'redis',
        port: 6379,
      },
      isGlobal: true,
    }),
    PrismaModule,
    StudentModule,
    CleaningModule,
  ],
})
export class AppModule {}
