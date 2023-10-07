import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { adminfindOneDoc } from './responses';

@ApiBearerAuth()
@ApiTags('Admin')
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @adminfindOneDoc()
  @Get()
  findOne(@User() user: UserInterface) {
    return this.adminService.findOne(user.id);
  }
}
