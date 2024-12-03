-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "signingKey" JSONB;

-- CreateTable
CREATE TABLE "ops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "holderId" UUID NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "ops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cas" (
    "caId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "holderId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "cas_pkey" PRIMARY KEY ("caId")
);

-- AddForeignKey
ALTER TABLE "ops" ADD CONSTRAINT "ops_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cas" ADD CONSTRAINT "cas_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
