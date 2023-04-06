import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaModule } from './prisma/prisma.module';
import { StudentModule } from './student/student.module';
import { CleaningModule } from './cleaning/cleaning.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
        host: 'localhost',
        port: 6379,
      },
      isGlobal: true,
    }),
    PrismaModule,
    StudentModule,
    CleaningModule,
    MailModule,
  ],
})
export class AppModule {}
