-- DropIndex
DROP INDEX "accounts_url_key";

-- AlterTable
ALTER TABLE "accounts" RENAME COLUMN "url" TO "domainNameOrUrl";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_domainNameOrUrl_key" ON "accounts"("domainNameOrUrl");
