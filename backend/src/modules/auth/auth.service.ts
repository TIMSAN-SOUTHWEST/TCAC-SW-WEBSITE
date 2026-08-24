import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import {
  LoginDto,
  UserRegisterDto,
  AdminRegisterDto,
  SuperAdminRegisterDto,
  SendResetCodeDto,
  VerifyResetCodeDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { UserCategory, CampType, PricingType, PaymentMode } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // ==============================
  // USER AUTH
  // ==============================

  async loginUser(dto: LoginDto) {
    const { emailOrID, password } = dto;

    const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID);
    const user = isEmail
      ? await this.prisma.user.findUnique({ where: { email: emailOrID } })
      : await this.prisma.user.findUnique({ where: { userID: emailOrID } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: 'user',
    });

    const { password: _, ...userWithoutPassword } = user;

    // Check if user is on installment plan and hasn't completed all payments
    if (user.paymentMode === 'installment' && user.installmentStep < 3) {
      return {
        token,
        user: userWithoutPassword,
        installmentBlocked: true,
        installmentMessage: 'You are on an installment payment plan. You can only access your dashboard after completing all 3 installment payments. Please contact the admin to make your next payment.',
        installmentStep: user.installmentStep,
        installmentPlan: user.installmentPlan,
        balance: user.balance,
      };
    }

    return { token, user: userWithoutPassword };
  }

  async registerUser(dto: UserRegisterDto) {
    // Check portal registration status
    const settings = await this.prisma.settings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (settings && !settings.portalRegistrationOpen) {
      throw new ForbiddenException(
        settings.registrationMessage || 'Portal Has Been Closed For Registration',
      );
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const userID = await this.generateUserID(dto.userCategory);

    // Map string enums to Prisma enums
    const userCategory = this.mapUserCategory(dto.userCategory);
    const campType = this.mapCampType(dto.campType);

    // Determine pricing tier by date: early-bird until Aug 31, 2026
    const now = new Date();
    const earlyBirdDeadline = new Date('2026-08-31T23:59:59');
    const autoTier = now <= earlyBirdDeadline ? 'early-bird' : 'standard';
    const pricingType = this.mapPricingType(autoTier);

    // Determine payment mode
    const isInstallment = dto.paymentMode === 'installment';
    const paymentMode = isInstallment ? PaymentMode.installment : PaymentMode.full;

    // Calculate balance
    const amountPaid = dto.amount ? parseInt(String(dto.amount)) : 0;
    const isNonTimsanite = dto.userCategory.toLowerCase() === 'non-timsanite';
    const tier = isNonTimsanite ? 'standard' : autoTier;

    let campPrice: number;
    if (isInstallment) {
      // For installment, get the total price from the installment plan
      campPrice = this.getInstallmentTotalPrice(dto.installmentPlan || '', dto.campType);
    } else {
      campPrice = this.getCampPrice(dto.userCategory, dto.campType, tier);
    }
    const balance = Math.max(0, campPrice - amountPaid);

    const newUser = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        gender: dto.gender as any,
        profilePicture: dto.profilePicture,
        role: 'user',
        userCategory,
        registrationStatus: 'pending',
        userID,
        institution: dto.institution,
        otherInstitution: dto.otherInstitution,
        graduationYear: dto.graduationYear,
        state: dto.state,
        otherState: dto.otherState,
        guardianName: dto.guardianName,
        guardianPhone: dto.guardianPhone,
        guardianAddress: dto.guardianAddress,
        nextOfKinName: dto.nextOfKinName,
        nextOfKinPhone: dto.nextOfKinPhone,
        nextOfKinAddress: dto.nextOfKinAddress,
        medicalCondition: dto.medicalCondition || false,
        conditionDetails: dto.conditionDetails,
        paymentType: dto.paymentType,
        pricingType,
        campType,
        amount: dto.amount,
        receiptUrl: dto.receiptUrl,
        paymentNarration: dto.paymentNarration,
        paymentMode,
        installmentPlan: isInstallment ? dto.installmentPlan : null,
        installmentStep: isInstallment ? 1 : 0,
        balance,
      },
    });

    // Create registration payment if amount > 0
    if (amountPaid > 0) {
      await this.prisma.payment.create({
        data: {
          userId: newUser.id,
          paymentType: dto.paymentType || 'Full Payment',
          pricingType,
          campType: dto.campType,
          amount: amountPaid,
          transactionDate: new Date(),
          receiptUrl: dto.receiptUrl || '',
          paymentNarration: isInstallment
            ? `Installment payment 1 of 3`
            : (dto.paymentNarration || 'Registration payment'),
          status: 'approved',
          adminComment: isInstallment ? 'Installment payment 1 of 3' : 'Registration payment',
        },
      });
    }

    return { message: 'User registered successfully' };
  }

  // ==============================
  // ADMIN AUTH
  // ==============================

  async loginAdmin(dto: LoginDto) {
    const { emailOrID, password } = dto;

    const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID);
    const admin = isEmail
      ? await this.prisma.admin.findUnique({ where: { email: emailOrID } })
      : await this.prisma.admin.findUnique({ where: { adminID: emailOrID } });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: admin.id,
      email: admin.email,
      role: 'admin',
    });

    const { password: _, ...adminWithoutPassword } = admin;
    return { message: 'Admin logged in successfully', token, adminData: adminWithoutPassword };
  }

  async registerAdmin(dto: AdminRegisterDto) {
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: dto.email },
    });
    if (existingAdmin) {
      throw new ConflictException('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const adminID = await this.generateAdminID();

    const newAdmin = await this.prisma.admin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        adminID,
      },
    });

    const { password: _, ...adminWithoutPassword } = newAdmin;
    return { message: 'Admin registered successfully', newAdmin: adminWithoutPassword };
  }

  // ==============================
  // SUPER ADMIN AUTH
  // ==============================

  async loginSuperAdmin(dto: LoginDto) {
    const { emailOrID, password } = dto;

    const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailOrID);
    const superAdmin = isEmail
      ? await this.prisma.superAdmin.findUnique({ where: { email: emailOrID } })
      : await this.prisma.superAdmin.findUnique({ where: { superAdminID: emailOrID } });

    if (!superAdmin) {
      throw new NotFoundException('Super Admin not found');
    }

    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: superAdmin.id,
      email: superAdmin.email,
      role: 'super_admin',
    });

    const { password: _, ...superAdminWithoutPassword } = superAdmin;
    return { message: 'Super Admin logged in successfully', token, superAdminData: superAdminWithoutPassword };
  }

  async registerSuperAdmin(dto: SuperAdminRegisterDto) {
    const existing = await this.prisma.superAdmin.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Super Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const superAdminID = await this.generateSuperAdminID();

    const newSuperAdmin = await this.prisma.superAdmin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        password: hashedPassword,
        superAdminID,
      },
    });

    const { password: _, ...saWithoutPassword } = newSuperAdmin;
    return { message: 'Super Admin registered successfully', newSuperAdmin: saWithoutPassword };
  }

  // ==============================
  // PASSWORD RESET (for all roles)
  // ==============================

  async sendResetCode(dto: SendResetCodeDto, role: 'user' | 'admin' | 'superAdmin') {
    let exists: boolean;

    if (role === 'user') {
      exists = !!(await this.prisma.user.findUnique({ where: { email: dto.email } }));
    } else if (role === 'admin') {
      exists = !!(await this.prisma.admin.findUnique({ where: { email: dto.email } }));
    } else {
      exists = !!(await this.prisma.superAdmin.findUnique({ where: { email: dto.email } }));
    }

    if (!exists) {
      throw new NotFoundException(`${role === 'superAdmin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)} not found`);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete existing codes for this email
    await this.prisma.resetCode.deleteMany({ where: { email: dto.email } });

    // Store new code
    await this.prisma.resetCode.create({
      data: { email: dto.email, code },
    });

    // Send email
    await this.mailService.sendResetCode(dto.email, code);

    return { message: 'Reset code sent' };
  }

  async verifyResetCodeAndChangePassword(dto: VerifyResetCodeDto, role: 'user' | 'admin' | 'superAdmin') {
    const resetCode = await this.prisma.resetCode.findFirst({
      where: { email: dto.email },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetCode) {
      throw new BadRequestException('No reset code found');
    }

    // Check expiry (15 minutes)
    const timeDiff = Date.now() - resetCode.createdAt.getTime();
    if (timeDiff > 15 * 60 * 1000) {
      await this.prisma.resetCode.delete({ where: { id: resetCode.id } });
      throw new BadRequestException('Reset code expired');
    }

    // Check attempts
    if (resetCode.attempts >= 5) {
      await this.prisma.resetCode.delete({ where: { id: resetCode.id } });
      throw new BadRequestException('Too many attempts');
    }

    // Increment attempts
    await this.prisma.resetCode.update({
      where: { id: resetCode.id },
      data: { attempts: resetCode.attempts + 1 },
    });

    if (resetCode.code !== dto.code) {
      throw new BadRequestException('Incorrect reset code');
    }

    // Code is valid - update password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    if (role === 'user') {
      await this.prisma.user.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    } else if (role === 'admin') {
      await this.prisma.admin.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    } else {
      await this.prisma.superAdmin.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    }

    // Clean up reset code
    await this.prisma.resetCode.deleteMany({ where: { email: dto.email } });

    return { message: 'Password reset successful' };
  }

  async resetPassword(dto: ResetPasswordDto, role: 'user' | 'admin' | 'superAdmin') {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    if (role === 'user') {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) throw new NotFoundException('User not found');
      await this.prisma.user.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    } else if (role === 'admin') {
      const admin = await this.prisma.admin.findUnique({ where: { email: dto.email } });
      if (!admin) throw new NotFoundException('Admin not found');
      await this.prisma.admin.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    } else {
      const superAdmin = await this.prisma.superAdmin.findUnique({ where: { email: dto.email } });
      if (!superAdmin) throw new NotFoundException('Super Admin not found');
      await this.prisma.superAdmin.update({ where: { email: dto.email }, data: { password: hashedPassword } });
    }

    return { message: 'Password reset successful' };
  }

  async verifyToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  // ==============================
  // HELPER METHODS
  // ==============================

  private mapUserCategory(category: string): UserCategory {
    switch (category.toLowerCase()) {
      case 'student': return UserCategory.Student;
      case 'alumnus': return UserCategory.Alumnus;
      case 'child':
      case 'children': return UserCategory.Child;
      case 'non-timsanite':
      case 'nontimsanite': return UserCategory.NonTIMSANITE;
      default: return UserCategory.Student;
    }
  }

  private mapCampType(type: string): CampType {
    switch (type) {
      case 'Camp Only': return CampType.CampOnly;
      case 'Conference Only': return CampType.ConferenceOnly;
      case 'Camp + Conference': return CampType.CampConference;
      default: return CampType.CampOnly;
    }
  }

  private mapPricingType(type?: string): PricingType {
    return type === 'early-bird' ? PricingType.earlyBird : PricingType.standard;
  }

  private async generateUserID(userCategory: string): Promise<string> {
    const categoryID = this.getCategoryID(userCategory);
    const houseAbbreviations = ['ABU', 'UMR', 'UTH', 'ALI'];

    const lastUser = await this.prisma.user.findFirst({
      where: { userID: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    let participantID: string;
    let participantIDCounter = 1;

    if (lastUser && lastUser.userID) {
      const parts = lastUser.userID.split('-');
      const lastParticipantID = parts[parts.length - 1];
      const lastAbbreviation = lastParticipantID.substring(0, 3);
      const lastCounter = parseInt(lastParticipantID.substring(3), 10);

      if (lastAbbreviation === 'ALI') {
        participantIDCounter = lastCounter + 1;
        participantID = `ABU${participantIDCounter.toString().padStart(3, '0')}`;
      } else {
        const lastIndex = houseAbbreviations.indexOf(lastAbbreviation);
        const nextIndex = (lastIndex + 1) % houseAbbreviations.length;
        participantID = `${houseAbbreviations[nextIndex]}${lastCounter.toString().padStart(3, '0')}`;
      }
    } else {
      participantID = `ABU${participantIDCounter.toString().padStart(3, '0')}`;
    }

    return `TCAC'26-${categoryID}-${participantID}`;
  }

  private getCategoryID(userCategory: string): string {
    switch (userCategory.toLowerCase()) {
      case 'student': return 'STD';
      case 'alumnus': return 'IOTB';
      case 'children':
      case 'child': return 'CHLD';
      case 'nontimsanite':
      case 'non-timsanite': return 'NTMS';
      default: return '';
    }
  }

  private async generateAdminID(): Promise<string> {
    const lastAdmin = await this.prisma.admin.findFirst({
      where: { adminID: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    if (lastAdmin && lastAdmin.adminID) {
      const parts = lastAdmin.adminID.split('-');
      const lastCounter = parseInt(parts[parts.length - 1]);
      return `TCAC'26-ADM-${(lastCounter + 1).toString().padStart(3, '0')}`;
    }
    return `TCAC'26-ADM-001`;
  }

  private async generateSuperAdminID(): Promise<string> {
    const last = await this.prisma.superAdmin.findFirst({
      where: { superAdminID: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    if (last && last.superAdminID) {
      const parts = last.superAdminID.split('-');
      const lastCounter = parseInt(parts[parts.length - 1]);
      return `TCAC'26-SADM-${(lastCounter + 1).toString().padStart(3, '0')}`;
    }
    return `TCAC'26-SADM-001`;
  }

  private getCampPrice(userCategory: string, campType: string, tier: string): number {
    const category = (userCategory || '').toLowerCase();
    const isEarlyBird = tier === 'early-bird' && category !== 'non-timsanite';

    const studentPrice = isEarlyBird
      ? { 'Camp Only': 6000, 'Conference Only': 30000, 'Camp + Conference': 36000 }
      : { 'Camp Only': 7000, 'Conference Only': 35000, 'Camp + Conference': 42000 };

    if (category === 'child' || category === 'children') {
      return isEarlyBird ? 3000 : 4000;
    }

    if (category === 'alumnus') {
      const prices = isEarlyBird
        ? { 'Camp Only': 8000, 'Conference Only': 30000, 'Camp + Conference': 44000 }
        : { 'Camp Only': 10000, 'Conference Only': 35000, 'Camp + Conference': 50000 };
      return prices[campType] ?? studentPrice[campType] ?? 0;
    }

    return studentPrice[campType] ?? 0;
  }

  /**
   * Get the total price for an installment plan.
   * Installment plans:
   * - Camp + Conference: 20k + 15k + 7k = 42k
   * - Conference Only (Early bird): 10k + 10k + 10k = 30k
   * - Conference Only (Late/Standard): 10k + 10k + 15k = 35k
   */
  private getInstallmentTotalPrice(installmentPlan: string, campType: string): number {
    switch (installmentPlan) {
      case 'camp_conference_42k':
        return 42000;
      case 'conference_early_30k':
        return 30000;
      case 'conference_standard_35k':
        return 35000;
      default:
        // Fallback: use standard pricing for the camp type
        if (campType === 'Camp + Conference') return 42000;
        if (campType === 'Conference Only') return 35000;
        return 0;
    }
  }

  /**
   * Get the installment amounts for a given plan.
   * Returns an array of 3 amounts representing each installment payment.
   */
  private getInstallmentAmounts(installmentPlan: string): number[] {
    switch (installmentPlan) {
      case 'camp_conference_42k':
        return [20000, 15000, 7000];
      case 'conference_early_30k':
        return [10000, 10000, 10000];
      case 'conference_standard_35k':
        return [10000, 10000, 15000];
      default:
        return [0, 0, 0];
    }
  }
}
