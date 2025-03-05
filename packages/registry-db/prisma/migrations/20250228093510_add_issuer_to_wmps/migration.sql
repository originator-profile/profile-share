/*
  Warnings:

  - The primary key for the `wmps` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `wmps` table. All the data in the column will be lost.
  - Added the required column `issuerId` to the `wmps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "wmps" DROP CONSTRAINT "wmps_pkey",
DROP COLUMN "id",
ADD COLUMN     "issuerId" UUID NOT NULL,
ADD CONSTRAINT "wmps_pkey" PRIMARY KEY ("issuerId", "holderId");

-- AddForeignKey
ALTER TABLE "wmps" ADD CONSTRAINT "wmps_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
