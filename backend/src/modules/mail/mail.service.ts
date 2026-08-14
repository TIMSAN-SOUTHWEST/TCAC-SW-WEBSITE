import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendResetCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Your Password Reset Code',
      text: `Your password reset code is: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #38A926;">TCAC'26 Password Reset</h2>
          <p>Your password reset code is:</p>
          <h1 style="color: #333; letter-spacing: 4px;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }
}
