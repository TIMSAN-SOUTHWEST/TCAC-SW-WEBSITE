import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DaysService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.day.findMany();
  }

  async create(data: { name: string; description?: string }) {
    if (!data.name) throw new BadRequestException('Name required');
    return this.prisma.day.create({ data: { name: data.name, description: data.description || '' } });
  }

  async update(id: string, data: { name: string; description?: string }) {
    if (!data.name) throw new BadRequestException('Name required');
    return this.prisma.day.update({ where: { id }, data: { name: data.name, description: data.description } });
  }

  async delete(id: string) {
    await this.prisma.day.delete({ where: { id } });
    return { success: true };
  }
}
