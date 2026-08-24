import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email address or User ID' })
  @IsNotEmpty()
  @IsString()
  emailOrID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: ['male', 'female'] })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  profilePicture: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ enum: ['Student', 'Alumnus', 'Child', 'Non-TIMSANITE'] })
  @IsNotEmpty()
  @IsString()
  userCategory: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  institution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherInstitution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otherState?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guardianName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guardianPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guardianAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextOfKinName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextOfKinPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextOfKinAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  medicalCondition?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionDetails?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentType?: string;

  @ApiPropertyOptional({ enum: ['standard', 'early-bird'] })
  @IsOptional()
  @IsString()
  pricingType?: string;

  @ApiProperty({ enum: ['Camp Only', 'Conference Only', 'Camp + Conference'] })
  @IsNotEmpty()
  @IsString()
  campType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentNarration?: string;

  @ApiPropertyOptional({ enum: ['full', 'installment'] })
  @IsOptional()
  @IsString()
  paymentMode?: string;

  @ApiPropertyOptional({ description: 'Installment plan identifier (e.g. camp_conference_42k, conference_early_30k, conference_standard_35k)' })
  @IsOptional()
  @IsString()
  installmentPlan?: string;
}

export class AdminRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SuperAdminRegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class SendResetCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyResetCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
