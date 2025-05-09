-- CreateTable
CREATE TABLE "pas" (
    "issuerId" UUID NOT NULL,
    "holderId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "pas_pkey" PRIMARY KEY ("issuerId", "holderId")
);

-- AddForeignKey
ALTER TABLE "pas" ADD CONSTRAINT "pas_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pas" ADD CONSTRAINT "pas_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
