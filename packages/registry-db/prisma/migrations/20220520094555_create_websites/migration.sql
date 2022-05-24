-- CreateTable
CREATE TABLE "websites" (
    "id" SERIAL NOT NULL,
    "accountId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "image" TEXT,
    "description" TEXT,
    "location" TEXT,
    "bodyFormatValue" TEXT NOT NULL,
    "proofJws" TEXT NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bodyFormats" (
    "value" TEXT NOT NULL,

    CONSTRAINT "bodyFormats_pkey" PRIMARY KEY ("value")
);

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websites" ADD CONSTRAINT "websites_bodyFormatValue_fkey" FOREIGN KEY ("bodyFormatValue") REFERENCES "bodyFormats"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Set `bodyFormats`
INSERT INTO "bodyFormats" ("value") VALUES ('html');
INSERT INTO "bodyFormats" ("value") VALUES ('text');
INSERT INTO "bodyFormats" ("value") VALUES ('visibleText');
