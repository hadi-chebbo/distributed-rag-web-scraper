-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "contentHash" TEXT;

-- CreateIndex
CREATE INDEX "Page_contentHash_idx" ON "Page"("contentHash");
