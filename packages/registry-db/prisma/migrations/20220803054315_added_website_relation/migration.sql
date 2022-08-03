-- AlterTable
ALTER TABLE "dps" ADD COLUMN     "websiteId" TEXT;

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("url") ON DELETE CASCADE ON UPDATE CASCADE;
