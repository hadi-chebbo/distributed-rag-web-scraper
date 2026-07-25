-- CreateTable
CREATE TABLE "PageChunk" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageChunk_pageId_idx" ON "PageChunk"("pageId");

-- AddForeignKey
ALTER TABLE "PageChunk" ADD CONSTRAINT "PageChunk_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
