-- DropIndex
DROP INDEX "public"."Outbox_createdAt_idx";

-- AlterTable
ALTER TABLE "Outbox" ADD COLUMN     "processedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Outbox_processedAt_createdAt_idx" ON "Outbox"("processedAt", "createdAt");
