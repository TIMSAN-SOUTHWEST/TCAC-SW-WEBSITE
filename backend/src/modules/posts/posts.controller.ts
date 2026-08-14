import { Controller, Get, Post, Put, Delete, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async findAll() {
    const data = await this.postsService.findAll();
    return { success: true, data };
  }

  @Get('published')
  async findPublished(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.postsService.findPublished(page || 1, limit || 2);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async create(@Body() body: any) {
    const data = await this.postsService.create(body);
    return { success: true, data };
  }

  @Put('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async reorder(@Body() body: { posts: { id: string; sortOrder: number }[] }) {
    return this.postsService.reorder(body.posts);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() body: any) {
    const data = await this.postsService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
