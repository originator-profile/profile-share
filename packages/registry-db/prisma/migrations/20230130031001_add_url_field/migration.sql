-- DropIndex
DROP INDEX "accounts_domainNameOrUrl_key";

-- AlterTable
ALTER TABLE "accounts" RENAME COLUMN "domainNameOrUrl" TO "domainName";
ALTER TABLE "accounts" ADD COLUMN "url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_domainName_key" ON "accounts"("domainName");
