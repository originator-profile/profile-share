-- CreateTable
CREATE TABLE "userAccounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "userAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "groupId" UUID NOT NULL,
    "reviewerId" TEXT,
    "certifierId" UUID,
    "statusValue" TEXT NOT NULL DEFAULT 'pending',
    "requestSummary" TEXT,
    "reviewSummary" TEXT,
    "opId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvalFlowStatus" (
    "value" TEXT NOT NULL,

    CONSTRAINT "approvalFlowStatus_pkey" PRIMARY KEY ("value")
);

--- Set `approvalFlowStatus`
INSERT INTO "approvalFlowStatus" ("value") VALUES ('pending');
INSERT INTO "approvalFlowStatus" ("value") VALUES ('approved');
INSERT INTO "approvalFlowStatus" ("value") VALUES ('rejected');
INSERT INTO "approvalFlowStatus" ("value") VALUES ('cancelled');

-- CreateTable
CREATE TABLE "reviewComments" (
    "id" SERIAL NOT NULL,
    "requestFieldName" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,

    CONSTRAINT "reviewComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userAccounts_accountId_key" ON "userAccounts"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "requests_opId_key" ON "requests"("opId");

-- AddForeignKey
ALTER TABLE "userAccounts" ADD CONSTRAINT "userAccounts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "userAccounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "userAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_statusValue_fkey" FOREIGN KEY ("statusValue") REFERENCES "approvalFlowStatus"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_opId_fkey" FOREIGN KEY ("opId") REFERENCES "ops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewComments" ADD CONSTRAINT "reviewComments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
