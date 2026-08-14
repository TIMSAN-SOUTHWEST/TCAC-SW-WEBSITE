import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.meal.findMany();
  }

  async create(data: { name: string; type: string; day: string; startTime: string; endTime: string; description?: string }) {
    if (!data.name || !data.type || !data.day || !data.startTime || !data.endTime) {
      throw new BadRequestException('All fields are required');
    }
    return this.prisma.meal.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.meal.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.meal.delete({ where: { id } });
    return { success: true };
  }
}
