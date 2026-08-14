import { Controller, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async findAll() {
    const data = await this.usersService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async approveUser(@Param('id') id: string) {
    const data = await this.usersService.approveUser(id);
    return { success: true, data };
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async rejectUser(@Param('id') id: string) {
    const data = await this.usersService.rejectUser(id);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
