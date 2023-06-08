/*
  Warnings:

  - You are about to drop the column `category` on the `websites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "websites" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "categories" (
    "cat" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cattax" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("cat","cattax")
);

-- CreateTable
CREATE TABLE "websiteCategories" (
    "websiteId" UUID NOT NULL,
    "categoryCat" TEXT NOT NULL,
    "categoryCattax" INTEGER NOT NULL,

    CONSTRAINT "websiteCategories_pkey" PRIMARY KEY ("websiteId","categoryCat","categoryCattax")
);

-- AddForeignKey
ALTER TABLE "websiteCategories" ADD CONSTRAINT "websiteCategories_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "websiteCategories" ADD CONSTRAINT "websiteCategories_categoryCat_categoryCattax_fkey" FOREIGN KEY ("categoryCat", "categoryCattax") REFERENCES "categories"("cat", "cattax") ON DELETE RESTRICT ON UPDATE CASCADE;
