import { CrawlStatus } from "@prisma/client";
import { prisma } from "../db/prisma.js";

export async function markCrawlRunning(crawlRunId: string) {
    return prisma.crawlRun.update({
        where: {
            id: crawlRunId,
        },
        data: {
            status: CrawlStatus.RUNNING,
            startedAt: new Date(),
        },
    });
}

export async function savePage(data: {
    crawlRunId: string;
    url: string;
    title: string | null;
    rawHtml: string;
    extractedText: string;
    statusCode: number;
}) {
    return prisma.page.create({
        data,
    });
}

export async function markCrawlCompleted(
  crawlRunId: string
) {
  return prisma.crawlRun.update({
    where: {
      id: crawlRunId,
    },
    data: {
      status: CrawlStatus.COMPLETED,
      completedAt: new Date(),
    },
  });
}


export async function markCrawlFailed(
  crawlRunId: string,
  error: string
) {
  return prisma.crawlRun.update({
    where: {
      id: crawlRunId,
    },
    data: {
      status: CrawlStatus.FAILED,
      error,
      completedAt: new Date(),
    },
  });
}