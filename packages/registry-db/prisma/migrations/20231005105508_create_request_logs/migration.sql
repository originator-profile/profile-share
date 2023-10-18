/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `requests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "reviewComments" DROP CONSTRAINT "reviewComments_requestId_fkey";

-- AlterTable
ALTER TABLE "reviewComments" ALTER COLUMN "requestId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "requestLogs" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT,
    "groupId" UUID,
    "reviewerId" TEXT,
    "certifierId" UUID,
    "statusValue" TEXT NOT NULL DEFAULT 'pending',
    "requestSummary" TEXT,
    "reviewSummary" TEXT,
    "opId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requestLogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requestLogReviewComments" (
    "requestLogId" INTEGER NOT NULL,
    "reviewCommentId" INTEGER NOT NULL,

    CONSTRAINT "requestLogReviewComments_pkey" PRIMARY KEY ("requestLogId","reviewCommentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "requestLogs_opId_key" ON "requestLogs"("opId");

-- CreateIndex
CREATE UNIQUE INDEX "requests_groupId_key" ON "requests"("groupId");

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "userAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "userAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_statusValue_fkey" FOREIGN KEY ("statusValue") REFERENCES "approvalFlowStatus"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_opId_fkey" FOREIGN KEY ("opId") REFERENCES "ops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogReviewComments" ADD CONSTRAINT "requestLogReviewComments_requestLogId_fkey" FOREIGN KEY ("requestLogId") REFERENCES "requestLogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requestLogReviewComments" ADD CONSTRAINT "requestLogReviewComments_reviewCommentId_fkey" FOREIGN KEY ("reviewCommentId") REFERENCES "reviewComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewComments" ADD CONSTRAINT "reviewComments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
