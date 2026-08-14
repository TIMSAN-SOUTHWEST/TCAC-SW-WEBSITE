import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admins')
@Controller('admins')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
@ApiBearerAuth()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async findAll() {
    const data = await this.adminsService.findAll();
    return { success: true, data };
  }

  @Put(':id/approve')
  async approveAdmin(@Param('id') id: string) {
    const data = await this.adminsService.approveAdmin(id);
    return { success: true, data };
  }

  @Put(':id/reject')
  async rejectAdmin(@Param('id') id: string) {
    const data = await this.adminsService.rejectAdmin(id);
    return { success: true, data };
  }

  @Put(':id/function')
  async updateAdminFunction(
    @Param('id') id: string,
    @Body('adminFunction') adminFunction: string,
  ) {
    const data = await this.adminsService.updateAdminFunction(id, adminFunction);
    return { success: true, data };
  }
}
