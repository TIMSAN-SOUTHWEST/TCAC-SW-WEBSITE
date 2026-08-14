import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  LoginDto,
  UserRegisterDto,
  AdminRegisterDto,
  SuperAdminRegisterDto,
  SendResetCodeDto,
  VerifyResetCodeDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==============================
  // USER AUTH
  // ==============================

  @Post('user/login')
  async loginUser(@Body() dto: LoginDto) {
    return this.authService.loginUser(dto);
  }

  @Post('user/register')
  async registerUser(@Body() dto: UserRegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('user/send-reset-code')
  async sendUserResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendResetCode(dto, 'user');
  }

  @Post('user/verify-reset-code')
  async verifyUserResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCodeAndChangePassword(dto, 'user');
  }

  @Post('user/reset-password')
  async resetUserPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto, 'user');
  }

  @Get('user/verify-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async verifyUserToken(@Request() req) {
    return this.authService.verifyToken(req.user.id);
  }

  // ==============================
  // ADMIN AUTH
  // ==============================

  @Post('admin/login')
  async loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto);
  }

  @Post('admin/register')
  async registerAdmin(@Body() dto: AdminRegisterDto) {
    return this.authService.registerAdmin(dto);
  }

  @Post('admin/send-reset-code')
  async sendAdminResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendResetCode(dto, 'admin');
  }

  @Post('admin/verify-reset-code')
  async verifyAdminResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCodeAndChangePassword(dto, 'admin');
  }

  @Post('admin/reset-password')
  async resetAdminPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto, 'admin');
  }

  // ==============================
  // SUPER ADMIN AUTH
  // ==============================

  @Post('super-admin/login')
  async loginSuperAdmin(@Body() dto: LoginDto) {
    return this.authService.loginSuperAdmin(dto);
  }

  @Post('super-admin/register')
  async registerSuperAdmin(@Body() dto: SuperAdminRegisterDto) {
    return this.authService.registerSuperAdmin(dto);
  }

  @Post('super-admin/send-reset-code')
  async sendSuperAdminResetCode(@Body() dto: SendResetCodeDto) {
    return this.authService.sendResetCode(dto, 'superAdmin');
  }

  @Post('super-admin/verify-reset-code')
  async verifySuperAdminResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCodeAndChangePassword(dto, 'superAdmin');
  }

  @Post('super-admin/reset-password')
  async resetSuperAdminPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto, 'superAdmin');
  }
}
