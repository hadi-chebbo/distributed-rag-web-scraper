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

export async function findPageByHash(contentHash: string) {
    return prisma.page.findFirst({
        where: {
            contentHash
        }
    });
}

export async function findPageByUrl(url: string) {
  return prisma.page.findFirst({
      where: {
            url
      },
      orderBy: {
        fetchedAt: "desc"
      }
  })
}

export async function savePage(data: {
    crawlRunId: string;
    url: string;
    title: string | null;
    rawHtml: string;
    extractedText: string;
    contentHash: string;
    statusCode: number;
}) {
    return prisma.page.create({
        data,
    });
}

export async function updatePage(pageId: string, data: {
  title: string;
  rawHtml: string;
  extractedText: string;
  contentHash: string;
  statusCode: number;
  fetchedAt: Date;
}) {
  return prisma.page.update({
    where: {
      id: pageId
    },
    data
  });
}

export async function savePageVersion(data: {
  pageId: string;
  contentHash: string;
  rawHtml: string;
  extractedText: string;
}) {
  return prisma.pageVersion.create({
    data
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