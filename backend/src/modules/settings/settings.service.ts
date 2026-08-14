import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, settings };
  }

  async createSettings(data: any) {
    const settings = await this.prisma.settings.create({
      data: {
        portalRegistrationOpen: data.portalRegistrationOpen ?? true,
        registrationMessage: data.registrationMessage ?? 'Portal Has Been Closed For Registration',
        paymentDeadline: data.paymentDeadline ? new Date(data.paymentDeadline) : null,
        paymentPortalOpen: data.paymentPortalOpen ?? true,
        paymentClosedMessage: data.paymentClosedMessage ?? 'Payment portal has been closed. Please contact administrator for assistance.',
        updatedBy: data.updatedBy || 'System',
      },
    });
    return { success: true, settings };
  }

  async updateSettings(data: any) {
    const settings = await this.prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      return this.createSettings(data);
    }

    const updatedSettings = await this.prisma.settings.update({
      where: { id: settings.id },
      data: {
        portalRegistrationOpen: data.portalRegistrationOpen ?? settings.portalRegistrationOpen,
        registrationMessage: data.registrationMessage ?? settings.registrationMessage,
        paymentDeadline: data.paymentDeadline ? new Date(data.paymentDeadline) : settings.paymentDeadline,
        paymentPortalOpen: data.paymentPortalOpen ?? settings.paymentPortalOpen,
        paymentClosedMessage: data.paymentClosedMessage ?? settings.paymentClosedMessage,
        updatedBy: data.updatedBy || settings.updatedBy,
      },
    });

    return { success: true, settings: updatedSettings };
  }

  async checkRegistration() {
    const settings = await this.prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      return {
        success: true,
        portalRegistrationOpen: true,
        registrationMessage: 'Portal Has Been Closed For Registration',
      };
    }

    return {
      success: true,
      portalRegistrationOpen: settings.portalRegistrationOpen,
      registrationMessage: settings.registrationMessage,
    };
  }
}
