import { Controller, Get, Post, Put, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ==============================
  // INSTALLMENT PAYMENT ENDPOINTS
  // ==============================

  @Post('installment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submitInstallmentPayment(@Body() body: any, @Request() req) {
    return this.paymentsService.submitInstallmentPayment(req.user.id, body);
  }

  @Get('installment/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getInstallmentHistory(@Request() req) {
    return this.paymentsService.getInstallmentHistory(req.user.id);
  }

  // ==============================
  // EXISTING ENDPOINTS
  // ==============================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createPayment(@Body() body: any) {
    return this.paymentsService.createPayment(body);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getPaymentHistory(@Query('userId') userId: string, @Request() req) {
    // Verify ownership or admin role
    const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';
    const isOwner = req.user.id === userId;
    if (!isAdmin && !isOwner) {
      return { error: 'Forbidden' };
    }
    const payments = await this.paymentsService.getPaymentHistory(userId);
    return { payments };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async getAllPayments(@Query('status') status?: string, @Query('search') search?: string) {
    return this.paymentsService.getAllPayments(status, search);
  }

  @Post('update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async updatePaymentStatus(@Body() body: any) {
    return this.paymentsService.updatePaymentStatus(
      body.paymentId,
      body.status,
      body.adminComment,
      body.userId,
      body.amount,
    );
  }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async submitPaymentRequest(@Body() body: { userId: string; message: string }) {
    return this.paymentsService.submitPaymentRequest(body.userId, body.message);
  }

  @Get('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async getPaymentRequests() {
    return this.paymentsService.getPaymentRequests();
  }

  @Put('requests')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async updatePaymentRequest(@Body() body: { userId: string; action: string; adminComment?: string }) {
    return this.paymentsService.updatePaymentRequest(body.userId, body.action, body.adminComment);
  }

  @Post('check-deadline')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async checkPaymentDeadline() {
    return this.paymentsService.checkPaymentDeadline();
  }
}
