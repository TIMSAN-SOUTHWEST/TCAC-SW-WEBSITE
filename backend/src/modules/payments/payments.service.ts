import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // ==============================
  // INSTALLMENT PAYMENT METHODS
  // ==============================

  async submitInstallmentPayment(userId: string, data: {
    amount: number;
    receiptUrl: string;
    paymentNarration?: string;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.paymentMode !== 'installment') {
      throw new BadRequestException('This user is not on an installment payment plan');
    }

    if (user.installmentStep >= 3) {
      throw new BadRequestException('All installment payments have already been completed');
    }

    const numericAmount = Number(data.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

    if (!data.receiptUrl) {
      throw new BadRequestException('Receipt URL is required');
    }

    // Create payment record with pending status (admin will approve)
    const payment = await this.prisma.payment.create({
      data: {
        userId: user.id,
        paymentType: 'Installment',
        pricingType: user.pricingType,
        campType: user.campType === 'CampConference' ? 'Camp + Conference' :
                  user.campType === 'ConferenceOnly' ? 'Conference Only' :
                  user.campType === 'CampOnly' ? 'Camp Only' : String(user.campType),
        amount: numericAmount,
        transactionDate: new Date(),
        receiptUrl: data.receiptUrl,
        paymentNarration: data.paymentNarration || `Installment payment ${user.installmentStep + 1} of 3`,
        status: 'pending',
        adminComment: '',
      },
    });

    return {
      success: true,
      message: `Installment payment submitted successfully. Awaiting admin approval.`,
      payment,
    };
  }

  async getInstallmentHistory(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payments = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    return {
      payments,
      installmentStep: user.installmentStep,
      installmentPlan: user.installmentPlan,
      balance: user.balance,
      paymentMode: user.paymentMode,
      totalPayments: 3,
    };
  }

  // ==============================
  // EXISTING METHODS
  // ==============================

  async createPayment(data: {
    userId: string;
    paymentType: string;
    pricingType?: string;
    campType: string;
    amount: number;
    transactionDate: string;
    receiptUrl: string;
    paymentNarration?: string;
    status?: string;
  }) {
    const numericAmount = Number(data.amount);
    if (isNaN(numericAmount)) {
      throw new BadRequestException('Amount must be a number');
    }

    const txDate = new Date(data.transactionDate);
    if (isNaN(txDate.getTime())) {
      throw new BadRequestException('Invalid transactionDate format');
    }

    const payment = await this.prisma.payment.create({
      data: {
        userId: data.userId,
        paymentType: data.paymentType,
        pricingType: data.pricingType === 'early-bird' ? 'earlyBird' : 'standard',
        campType: data.campType,
        amount: numericAmount,
        transactionDate: txDate,
        receiptUrl: data.receiptUrl,
        paymentNarration: data.paymentNarration,
        status: (data.status as any) || 'pending',
      },
    });

    return { success: true, payment };
  }

  async getPaymentHistory(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPayments(status?: string, search?: string) {
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search && search.trim()) {
      const searchTerms = search.trim().split(/\s+/);
      where.user = {
        AND: searchTerms.map((term) => ({
          OR: [
            { firstName: { contains: term, mode: 'insensitive' } },
            { lastName: { contains: term, mode: 'insensitive' } },
          ],
        })),
      };
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            paymentMode: true,
            installmentStep: true,
            installmentPlan: true,
            balance: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(paymentId: string, status: string, adminComment?: string, userId?: string, amount?: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        adminComment: adminComment || '',
      },
    });

    // If approved, decrease user balance and handle installment step
    if (status === 'approved' && userId && amount) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      
      const updateData: any = {
        balance: { decrement: Number(amount) },
      };

      // If user is on installment plan, increment their installment step
      if (user && user.paymentMode === 'installment' && user.installmentStep < 3) {
        updateData.installmentStep = { increment: 1 };
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    }

    return { success: true };
  }

  // Payment request methods
  async submitPaymentRequest(userId: string, message: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        paymentRequestMessage: message,
        paymentRequestDate: new Date(),
        paymentRequestStatus: 'pending',
      },
    });

    return { success: true, message: 'Payment request submitted successfully' };
  }

  async getPaymentRequests() {
    return this.prisma.user.findMany({
      where: {
        paymentRequestStatus: { in: ['pending', 'approved', 'rejected', 'revoked'] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userID: true,
        balance: true,
        paymentRequestMessage: true,
        paymentRequestDate: true,
        paymentRequestStatus: true,
        paymentAccessGranted: true,
      },
    });
  }

  async updatePaymentRequest(userId: string, action: string, adminComment?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {};

    if (action === 'approve') {
      updateData.paymentRequestStatus = 'approved';
      updateData.paymentAccessGranted = true;
    } else if (action === 'reject') {
      updateData.paymentRequestStatus = 'rejected';
      updateData.paymentAccessGranted = false;
    } else if (action === 'revoke') {
      updateData.paymentRequestStatus = 'revoked';
      updateData.paymentAccessGranted = false;
    }

    if (adminComment) {
      updateData.paymentRequestMessage = adminComment;
    }

    await this.prisma.user.update({ where: { id: userId }, data: updateData });

    return { success: true, message: `Payment access ${action}d successfully` };
  }

  async checkPaymentDeadline() {
    const settings = await this.prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings || !settings.paymentDeadline) {
      return { message: 'No payment deadline set', usersChecked: 0 };
    }

    const now = new Date();
    const deadline = new Date(settings.paymentDeadline);

    if (now < deadline) {
      return {
        message: 'Payment deadline has not passed yet',
        deadline: deadline.toISOString(),
        usersChecked: 0,
      };
    }

    const usersWithBalance = await this.prisma.user.findMany({
      where: {
        balance: { gt: 0 },
        paymentAccessGranted: { not: true },
        paymentRequestStatus: { not: 'approved' },
        role: 'user',
      },
    });

    let usersUpdated = 0;
    for (const user of usersWithBalance) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { paymentAccessGranted: false },
      });
      usersUpdated++;
    }

    return {
      success: true,
      message: `Payment deadline check completed. ${usersUpdated} users with outstanding balance found.`,
      usersChecked: usersWithBalance.length,
      usersUpdated,
      deadline: deadline.toISOString(),
    };
  }
}
