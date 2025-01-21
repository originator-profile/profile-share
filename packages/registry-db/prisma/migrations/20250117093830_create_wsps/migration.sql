-- CreateTable
CREATE TABLE "wsps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "holderId" UUID NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "wsps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wsps_url_key" ON "wsps"("url");

-- AddForeignKey
ALTER TABLE "wsps" ADD CONSTRAINT "wsps_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
