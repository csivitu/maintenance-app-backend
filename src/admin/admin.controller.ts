import { Controller, Get, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from 'src/auth/auth.decorator';
import { UserInterface } from 'src/auth/interfaces/user.interface';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { adminfindOneDoc } from './responses';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { adminHomePageDoc } from './responses/adminHomePage.respose';

@ApiBearerAuth()
@ApiTags('Admin')
@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @adminfindOneDoc()
  @SetMetadata('roles', ['cleaningAdmin', 'superAdmin'])
  @UseGuards(RolesGuard)
  @Get()
  findOne(@User() user: UserInterface) {
    return this.adminService.findOne(user.id);
  }

  @adminHomePageDoc()
  @SetMetadata('roles', ['cleaningAdmin', 'superAdmin'])
  @UseGuards(RolesGuard)
  @Get('admin-home-page')
  async AdminHomePage(@User() user: UserInterface) {
    return await this.adminService.adminHomePage(user.id);
  }
}
