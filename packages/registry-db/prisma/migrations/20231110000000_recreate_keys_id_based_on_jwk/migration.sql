-- AlterTable
ALTER TABLE "keys" DROP COLUMN "id";

-- AlterTable
ALTER TABLE "keys" ADD COLUMN "id" TEXT NOT NULL GENERATED ALWAYS AS ("jwk"->>'kid') STORED,
ADD CONSTRAINT "keys_pkey" PRIMARY KEY ("id");
