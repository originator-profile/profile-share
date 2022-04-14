-- CreateTable
CREATE TABLE "ops" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "certifierId" UUID NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "jwt" TEXT NOT NULL,

    CONSTRAINT "ops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" TEXT NOT NULL,
    "roleValue" TEXT NOT NULL DEFAULT E'group',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "addressCountry" TEXT NOT NULL,
    "addressRegion" TEXT NOT NULL,
    "addressLocality" TEXT NOT NULL,
    "addressStreet" TEXT NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "value" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("value")
);

-- Set `roles`
INSERT INTO "roles" ("value") VALUES ('group');
INSERT INTO "roles" ("value") VALUES ('certifier');

-- CreateTable
CREATE TABLE "businessCategories" (
    "value" TEXT NOT NULL,

    CONSTRAINT "businessCategories_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "accountBusinessCategories" (
    "accountId" UUID NOT NULL,
    "businessCategoryValue" TEXT NOT NULL,

    CONSTRAINT "accountBusinessCategories_pkey" PRIMARY KEY ("accountId","businessCategoryValue")
);

-- CreateTable
CREATE TABLE "logos" (
    "url" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "accountId" UUID NOT NULL,

    CONSTRAINT "logos_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "publications" (
    "opId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("opId")
);

-- CreateTable
CREATE TABLE "keys" (
    "id" SERIAL NOT NULL,
    "accountId" UUID NOT NULL,
    "jwk" JSONB NOT NULL,

    CONSTRAINT "keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ops_jwt_key" ON "ops"("jwt");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_url_key" ON "accounts"("url");

-- AddForeignKey
ALTER TABLE "ops" ADD CONSTRAINT "ops_certifierId_fkey" FOREIGN KEY ("certifierId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_roleValue_fkey" FOREIGN KEY ("roleValue") REFERENCES "roles"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountBusinessCategories" ADD CONSTRAINT "accountBusinessCategories_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountBusinessCategories" ADD CONSTRAINT "accountBusinessCategories_businessCategoryValue_fkey" FOREIGN KEY ("businessCategoryValue") REFERENCES "businessCategories"("value") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logos" ADD CONSTRAINT "logos_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_opId_fkey" FOREIGN KEY ("opId") REFERENCES "ops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keys" ADD CONSTRAINT "keys_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
