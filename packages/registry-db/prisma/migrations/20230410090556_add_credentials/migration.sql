-- CreateTable
CREATE TABLE "credentials" (
    "id" SERIAL NOT NULL,
    "accountId" UUID NOT NULL,
    "certifierId" UUID NOT NULL,
    "verifierId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_verifierId_fkey" FOREIGN KEY ("verifierId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
