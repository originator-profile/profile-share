-- AlterTable
ALTER TABLE "dps" ADD COLUMN     "adId" UUID;

-- CreateTable
CREATE TABLE "ads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accountId" UUID NOT NULL,
    "title" TEXT,
    "image" TEXT,
    "description" TEXT,
    "location" TEXT,
    "bodyFormatValue" TEXT NOT NULL,
    "proofJws" TEXT NOT NULL,
    "allowedOrigins" TEXT[],

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ads" ADD CONSTRAINT "ads_bodyFormatValue_fkey" FOREIGN KEY ("bodyFormatValue") REFERENCES "bodyFormats"("value") ON DELETE RESTRICT ON UPDATE CASCADE;
