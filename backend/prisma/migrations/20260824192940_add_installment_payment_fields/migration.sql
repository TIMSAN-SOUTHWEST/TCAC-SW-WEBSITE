-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('full', 'installment');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "installmentPlan" TEXT,
ADD COLUMN     "installmentStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "paymentMode" "PaymentMode" NOT NULL DEFAULT 'full';
