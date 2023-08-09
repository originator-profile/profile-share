-- CreateTable
CREATE TABLE "userAccounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountId" UUID NOT NULL,

    CONSTRAINT "userAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "userAccountsId" TEXT NOT NULL,
    "requestStatusValue" TEXT NOT NULL DEFAULT 'unreviewed',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requestStatus" (
    "value" TEXT NOT NULL,

    CONSTRAINT "requestStatus_pkey" PRIMARY KEY ("value")
);

-- Set `requestStatus`
INSERT INTO "requestStatus" ("value") VALUES ('unreviewed');
INSERT INTO "requestStatus" ("value") VALUES ('reviewed');
INSERT INTO "requestStatus" ("value") VALUES ('cancelled');

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "userAccountsId" TEXT NOT NULL,
    "reviewStatusValue" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "requestId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviewStatus" (
    "value" TEXT NOT NULL,

    CONSTRAINT "reviewStatus_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "reviewComments" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "reviewComments_pkey" PRIMARY KEY ("id")
);

-- Set `reviewStatus`
INSERT INTO "reviewStatus" ("value") VALUES ('pending');
INSERT INTO "reviewStatus" ("value") VALUES ('accepted');
INSERT INTO "reviewStatus" ("value") VALUES ('rejected');

-- CreateIndex
CREATE UNIQUE INDEX "reviews_requestId_key" ON "reviews"("requestId");

-- AddForeignKey
ALTER TABLE "userAccounts" ADD CONSTRAINT "userAccounts_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userAccountsId_fkey" FOREIGN KEY ("userAccountsId") REFERENCES "userAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requestStatusValue_fkey" FOREIGN KEY ("requestStatusValue") REFERENCES "requestStatus"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userAccountsId_fkey" FOREIGN KEY ("userAccountsId") REFERENCES "userAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewStatusValue_fkey" FOREIGN KEY ("reviewStatusValue") REFERENCES "reviewStatus"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewComments" ADD CONSTRAINT "reviewComments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
