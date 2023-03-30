import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';

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
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
