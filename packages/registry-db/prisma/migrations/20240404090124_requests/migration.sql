ALTER TABLE "ops" ADD COLUMN "requestId" INTEGER;

UPDATE "ops"
SET "requestId" = "requests"."id"
FROM "requests"
WHERE "requests"."opId" = "ops"."id";

CREATE UNIQUE INDEX "ops_requestId_key" ON "ops"("requestId");

ALTER TABLE "ops" ADD CONSTRAINT "ops_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "requestLogReviewComments" DROP CONSTRAINT "requestLogReviewComments_requestLogId_fkey";
ALTER TABLE "requestLogReviewComments" DROP CONSTRAINT "requestLogReviewComments_reviewCommentId_fkey";
ALTER TABLE "requestLogs" DROP CONSTRAINT "requestLogs_authorId_fkey";
ALTER TABLE "requestLogs" DROP CONSTRAINT "requestLogs_groupId_fkey";
ALTER TABLE "requestLogs" DROP CONSTRAINT "requestLogs_opId_fkey";
ALTER TABLE "requests" DROP CONSTRAINT "requests_authorId_fkey";
ALTER TABLE "requests" DROP CONSTRAINT "requests_certifierId_fkey";
ALTER TABLE "requests" DROP CONSTRAINT "requests_opId_fkey";
ALTER TABLE "requests" DROP CONSTRAINT "requests_reviewerId_fkey";
ALTER TABLE "requests" DROP CONSTRAINT "requests_statusValue_fkey";

DROP INDEX "requestLogs_opId_key";
DROP INDEX "requests_opId_key";

ALTER TABLE "requestLogs" RENAME COLUMN "updatedAt" TO "insertedAt";
ALTER TABLE "requestLogs"
DROP COLUMN "createdAt",
DROP COLUMN "opId",
ADD COLUMN "requestId" INTEGER,
ALTER COLUMN "authorId" SET NOT NULL,
ALTER COLUMN "insertedAt" SET DEFAULT CURRENT_TIMESTAMP;

UPDATE "requestLogs"
SET "requestId" = "requests"."id"
FROM "requests"
WHERE "requests"."groupId" = "requestLogs"."groupId";

ALTER TABLE "requestLogs"
DROP COLUMN "groupId",
ALTER COLUMN "requestId" SET NOT NULL;

ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "requestLogs" ADD CONSTRAINT "requestLogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "userAccounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "requests"
DROP COLUMN "authorId",
DROP COLUMN "certifierId",
DROP COLUMN "createdAt",
DROP COLUMN "opId",
DROP COLUMN "requestSummary",
DROP COLUMN "reviewSummary",
DROP COLUMN "reviewerId",
DROP COLUMN "statusValue",
DROP COLUMN "updatedAt";

ALTER TABLE "reviewComments" DROP CONSTRAINT "reviewComments_requestId_fkey";
ALTER TABLE "reviewComments" DROP COLUMN "requestId", ADD COLUMN "requestLogId" INTEGER;

UPDATE "reviewComments"
SET "requestLogId" = "requestLogReviewComments"."requestLogId"
FROM "requestLogReviewComments"
WHERE "requestLogReviewComments"."reviewCommentId" = "reviewComments"."id";

DROP TABLE "requestLogReviewComments";
ALTER TABLE "reviewComments" ALTER COLUMN "requestLogId" SET NOT NULL;
ALTER TABLE "reviewComments" ADD CONSTRAINT "reviewComments_requestLogId_fkey" FOREIGN KEY ("requestLogId") REFERENCES "requestLogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
