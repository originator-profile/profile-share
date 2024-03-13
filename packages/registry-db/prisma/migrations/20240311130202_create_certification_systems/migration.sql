-- CreateTable
CREATE TABLE "certificationSystems" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL,
    "urlTitle" TEXT NOT NULL,
    "image" TEXT,
    "certifierUuid" UUID NOT NULL,
    "verifierUuid" UUID NOT NULL,

    CONSTRAINT "certificationSystems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "certificationSystems" ADD CONSTRAINT "certificationSystems_certifierUuid_fkey" FOREIGN KEY ("certifierUuid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificationSystems" ADD CONSTRAINT "certificationSystems_verifierUuid_fkey" FOREIGN KEY ("verifierUuid") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
