-- CreateEnum
CREATE TYPE "CrawlUrlStatus" AS ENUM ('PENDING', 'CRAWLING', 'COMPLETED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_crawlRunId_fkey";

-- CreateTable
CREATE TABLE "CrawledUrl" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "crawlRunId" TEXT NOT NULL,
    "status" "CrawlUrlStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawledUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrawledUrl_url_key" ON "CrawledUrl"("url");

-- CreateIndex
CREATE INDEX "CrawledUrl_crawlRunId_idx" ON "CrawledUrl"("crawlRunId");

-- CreateIndex
CREATE INDEX "CrawledUrl_status_idx" ON "CrawledUrl"("status");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_crawlRunId_fkey" FOREIGN KEY ("crawlRunId") REFERENCES "CrawlRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawledUrl" ADD CONSTRAINT "CrawledUrl_crawlRunId_fkey" FOREIGN KEY ("crawlRunId") REFERENCES "CrawlRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
