-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "UserCategory" AS ENUM ('Student', 'Alumnus', 'Child', 'Non-TIMSANITE');

-- CreateEnum
CREATE TYPE "CampType" AS ENUM ('Camp Only', 'Conference Only', 'Camp + Conference');

-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('standard', 'early-bird');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PaymentRequestStatus" AS ENUM ('pending', 'approved', 'rejected', 'revoked');

-- CreateEnum
CREATE TYPE "AdminFunction" AS ENUM ('admin', 'reg_team_lead', 'health_team_lead');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('Header and Paragraph', 'Video Embed', 'Popout/Modal', 'Gallery', 'Banner', 'Slider');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('info', 'warning', 'success', 'error');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "userCategory" "UserCategory" NOT NULL DEFAULT 'Student',
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "userID" TEXT,
    "institution" TEXT,
    "otherInstitution" TEXT,
    "graduationYear" INTEGER,
    "state" TEXT,
    "otherState" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "guardianAddress" TEXT,
    "nextOfKinName" TEXT,
    "nextOfKinPhone" TEXT,
    "nextOfKinAddress" TEXT,
    "medicalCondition" BOOLEAN NOT NULL DEFAULT false,
    "conditionDetails" TEXT,
    "paymentType" TEXT,
    "pricingType" "PricingType" NOT NULL DEFAULT 'standard',
    "campType" "CampType" NOT NULL DEFAULT 'Camp Only',
    "amount" DOUBLE PRECISION,
    "receiptUrl" TEXT,
    "paymentNarration" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 35000,
    "paymentAccessGranted" BOOLEAN NOT NULL DEFAULT false,
    "paymentRequestMessage" TEXT,
    "paymentRequestDate" TIMESTAMP(3),
    "paymentRequestStatus" "PaymentRequestStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "adminFunction" "AdminFunction" NOT NULL DEFAULT 'admin',
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "adminID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'super_admin',
    "superAdminID" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "pricingType" "PricingType" NOT NULL DEFAULT 'standard',
    "campType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT NOT NULL,
    "paymentNarration" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "adminComment" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "postType" "PostType" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "facilitator" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'info',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slips" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slipCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "portalRegistrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "registrationMessage" TEXT NOT NULL DEFAULT 'Portal Has Been Closed For Registration',
    "paymentDeadline" TIMESTAMP(3),
    "paymentPortalOpen" BOOLEAN NOT NULL DEFAULT true,
    "paymentClosedMessage" TEXT NOT NULL DEFAULT 'Payment portal has been closed. Please contact administrator for assistance.',
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reset_codes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reset_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_userID_key" ON "users"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_adminID_key" ON "admins"("adminID");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_email_key" ON "super_admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_superAdminID_key" ON "super_admins"("superAdminID");

-- CreateIndex
CREATE UNIQUE INDEX "slips_userId_key" ON "slips"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "slips_slipCode_key" ON "slips"("slipCode");

-- CreateIndex
CREATE INDEX "reset_codes_email_createdAt_idx" ON "reset_codes"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slips" ADD CONSTRAINT "slips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
