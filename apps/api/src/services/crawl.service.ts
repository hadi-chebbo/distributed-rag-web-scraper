import { prisma } from "../db/prisma.js";
import { crawlerQueue } from "../queues/crawler.queue.js";

export async function createCrawlRun(url: string) {
    const crawlRun = await prisma.crawlRun.create({
        data: {
            startUrl: url,
        },
    });

    const job = await crawlerQueue.add("crawl", {
        crawlRunId: crawlRun.id,
        url,
    });

    return {
        crawlRun,
        job,
    };
}

export async function getCrawlRun(id: string) {
    return prisma.crawlRun.findUnique({
        where: {
            id,
        },
        include: {
            pages: {
                orderBy: {
                    fetchedAt: "desc",
                },
            },
        },
    });
}