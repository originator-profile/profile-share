/*
  Warnings:

  - The primary key for the `websites` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "websites" DROP CONSTRAINT "websites_pkey",
ADD CONSTRAINT "websites_pkey" PRIMARY KEY ("url");
