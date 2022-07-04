-- CreateTable
CREATE TABLE "admins" (
    "adminId" UUID NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("adminId")
);

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
