/*
  Warnings:

  - A unique constraint covering the columns `[url,crawlRunId]` on the table `CrawledUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CrawledUrl_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "CrawledUrl_url_crawlRunId_key" ON "CrawledUrl"("url", "crawlRunId");
