import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number) {
    try {
      const user = await this.prismaService.staff.findUnique({
        where: {
          id: id,
        },
      });

      if (!user) throw new NotFoundException(`User with id ${id} not found`);

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors here
        throw new InternalServerErrorException(
          `Database Error: ${error.message}`,
        );
      } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        // Handle unknown Prisma errors here
        throw new InternalServerErrorException(
          `Unknown Database Error: ${error.message}`,
        );
      } else {
        // Fallback error handling
        throw new InternalServerErrorException(
          `Unexpected Error: ${error.message}`,
        );
      }
    }
  }
}
