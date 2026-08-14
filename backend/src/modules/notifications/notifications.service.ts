import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.notification.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { title: string; message: string; type?: string }) {
    return this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: (data.type as any) || 'info',
        createdBy: 'admin',
      },
    });
  }

  async update(id: string, data: { title?: string; message?: string; type?: string; isActive?: boolean }) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.prisma.notification.delete({ where: { id } });
    return { success: true, message: 'Notification deleted successfully' };
  }
}
