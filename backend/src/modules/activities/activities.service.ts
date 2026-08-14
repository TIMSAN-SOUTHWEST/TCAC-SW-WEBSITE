import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.activity.findMany();
  }

  async create(data: { name: string; day: string; startTime: string; endTime: string; facilitator: string; description?: string }) {
    return this.prisma.activity.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.activity.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.prisma.activity.delete({ where: { id } });
    return { success: true, message: 'Deleted successfully' };
  }
}
