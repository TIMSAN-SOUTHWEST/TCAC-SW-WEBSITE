import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveAdmin(id: string) {
    return this.prisma.admin.update({
      where: { id },
      data: { registrationStatus: 'approved' },
    });
  }

  async rejectAdmin(id: string) {
    return this.prisma.admin.update({
      where: { id },
      data: { registrationStatus: 'rejected' },
    });
  }

  async updateAdminFunction(id: string, adminFunction: string) {
    return this.prisma.admin.update({
      where: { id },
      data: { adminFunction: adminFunction as any },
    });
  }
}
