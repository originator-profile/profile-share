-- CreateTable
CREATE TABLE "dps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "issuerId" UUID NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "jwt" TEXT NOT NULL,

    CONSTRAINT "dps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dps_jwt_key" ON "dps"("jwt");

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
