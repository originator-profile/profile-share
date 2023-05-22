-- DropForeignKey
ALTER TABLE "dps" DROP CONSTRAINT "dps_websiteId_fkey";

-- AlterTable
ALTER TABLE "dps" RENAME COLUMN "websiteId" TO "url";

-- AlterTable
ALTER TABLE "dps" ADD COLUMN "websiteId" UUID;

-- AlterTable
ALTER TABLE "websites" DROP CONSTRAINT "websites_pkey",
ADD COLUMN "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "websites_pkey" PRIMARY KEY ("id");

-- Set "websiteId" based on existing websites
UPDATE "dps"
SET "websiteId" = "websites"."id"
FROM "websites"
WHERE "dps"."url" = "websites"."url";

-- AddForeignKey
ALTER TABLE "dps" ADD CONSTRAINT "dps_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
