-- CreateTable
CREATE TABLE "wmps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "holderId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "wmps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wmps" ADD CONSTRAINT "wmps_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
