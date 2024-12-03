-- DropForeignKey
ALTER TABLE "ops" DROP CONSTRAINT "ops_certifierId_fkey";

-- DropForeignKey
ALTER TABLE "ops" DROP CONSTRAINT "ops_requestId_fkey";

-- DropForeignKey
ALTER TABLE "publications" DROP CONSTRAINT "publications_opId_fkey";

-- AlterTable
ALTER TABLE "ops" RENAME TO "oldOps";

-- AlterTable
ALTER TABLE "oldOps" RENAME CONSTRAINT "ops_pkey" TO "oldOps_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "oldOps_requestId_key" ON "oldOps"("requestId");

-- AddForeignKey
ALTER TABLE "oldOps" ADD CONSTRAINT "oldOps_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oldOps" ADD CONSTRAINT "oldOps_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_opId_fkey" FOREIGN KEY ("opId") REFERENCES "oldOps"("id") ON DELETE CASCADE ON UPDATE CASCADE;
