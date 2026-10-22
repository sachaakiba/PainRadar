-- AlterTable
ALTER TABLE "analyses" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "analyses" ADD COLUMN "shareSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "analyses_shareSlug_key" ON "analyses"("shareSlug");
