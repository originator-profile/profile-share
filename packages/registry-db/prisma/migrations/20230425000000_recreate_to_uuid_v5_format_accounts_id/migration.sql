CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" DROP EXPRESSION IF EXISTS;

-- Update to UUID v5 format accounts.id
UPDATE "accounts" SET "id" = uuid_generate_v5(uuid_ns_dns(), "domainName");

-- Remove accounts.id

-- DropForeignKey
ALTER TABLE "accountBusinessCategories" DROP CONSTRAINT "accountBusinessCategories_accountId_fkey";

-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_roleValue_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_adminId_fkey";

-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_accountId_fkey";

-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_certifierId_fkey";

-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_verifierId_fkey";

-- DropForeignKey
ALTER TABLE "dps" DROP CONSTRAINT "dps_issuerId_fkey";

-- DropForeignKey
ALTER TABLE "keys" DROP CONSTRAINT "keys_accountId_fkey";

-- DropForeignKey
ALTER TABLE "logos" DROP CONSTRAINT "logos_accountId_fkey";

-- DropForeignKey
ALTER TABLE "ops" DROP CONSTRAINT "ops_certifierId_fkey";

-- DropForeignKey
ALTER TABLE "publications" DROP CONSTRAINT "publications_accountId_fkey";

-- DropForeignKey
ALTER TABLE "websites" DROP CONSTRAINT "websites_accountId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_pkey",
DROP COLUMN "id";

-- Recreate accounts.id

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN "id" UUID NOT NULL GENERATED ALWAYS AS (uuid_generate_v5(uuid_ns_dns(), "domainName")) STORED,
ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ops" ADD CONSTRAINT "ops_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_roleValue_fkey" FOREIGN KEY ("roleValue") REFERENCES "roles"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountBusinessCategories" ADD CONSTRAINT "accountBusinessCategories_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keys" ADD CONSTRAINT "keys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
