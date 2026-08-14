import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SlipsService {
  constructor(private prisma: PrismaService) {}

  private generateSlipCode(): string {
    return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
  }

  async generateSlip(userId: string) {
    // Check if slip already exists
    const existingSlip = await this.prisma.slip.findUnique({ where: { userId } });
    if (existingSlip) {
      return { slipCode: existingSlip.slipCode };
    }

    // Generate unique code
    let slipCode: string = this.generateSlipCode();
    let exists = true;
    while (exists) {
      slipCode = this.generateSlipCode();
      const found = await this.prisma.slip.findUnique({ where: { slipCode } });
      exists = !!found;
    }

    const slip = await this.prisma.slip.create({
      data: { userId, slipCode },
    });

    return { slipCode: slip.slipCode };
  }

  async getAllSlips() {
    const slips = await this.prisma.slip.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            userID: true,
            userCategory: true,
            phoneNumber: true,
            gender: true,
            institution: true,
            otherInstitution: true,
            state: true,
            otherState: true,
            campType: true,
            profilePicture: true,
            balance: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return {
      slips: slips.map((s) => ({
        ...s,
        user: s.user,
      })),
    };
  }
}
