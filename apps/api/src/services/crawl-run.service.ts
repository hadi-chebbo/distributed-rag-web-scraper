import { prisma } from "../db/prisma.js";
import { crawlQueue } from "../queues/crawl.queue.js";

export async function createCrawlRun(url: string) {
    const crawlRun = await prisma.crawlRun.create({
        data: {
            startUrl: url,
        },
    });

    const job = await crawlQueue.add("fetch-page", {
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