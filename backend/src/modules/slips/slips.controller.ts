import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SlipsService } from './slips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Slips')
@Controller('slips')
export class SlipsController {
  constructor(private readonly slipsService: SlipsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async generateSlip(@Body() body: { userId: string }) {
    return this.slipsService.generateSlip(body.userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async getAllSlips() {
    return this.slipsService.getAllSlips();
  }
}
