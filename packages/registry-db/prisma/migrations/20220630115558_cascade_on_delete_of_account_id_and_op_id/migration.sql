-- DropForeignKey
ALTER TABLE "accountBusinessCategories" DROP CONSTRAINT "accountBusinessCategories_accountId_fkey";

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
ALTER TABLE "publications" DROP CONSTRAINT "publications_opId_fkey";

-- DropForeignKey
ALTER TABLE "websites" DROP CONSTRAINT "websites_accountId_fkey";

-- AddForeignKey
ALTER TABLE "ops" ADD CONSTRAINT "ops_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountBusinessCategories" ADD CONSTRAINT "accountBusinessCategories_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_opId_fkey" FOREIGN KEY ("opId") REFERENCES "ops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keys" ADD CONSTRAINT "keys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
