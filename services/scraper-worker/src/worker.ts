import { PrismaClient, CrawlStatus } from "@prisma/client";
import { CRAWL_QUEUE, crawlJobSchema, createRedisConnection } from "@scraper/shared";
import axios from "axios";
import * as cheerio from "cheerio";
import { Worker } from "bullmq";

const prisma = new PrismaClient();

const worker = new Worker(
  CRAWL_QUEUE,
  async (job) => {
    const { crawlRunId, url } = crawlJobSchema.parse(job.data);
    await prisma.crawlRun.update({
      where: { id: crawlRunId },
      data: { status: CrawlStatus.RUNNING, startedAt: new Date() },
    });

    const response = await axios.get<string>(url, {
      timeout: 15_000,
      responseType: "text",
      headers: { "User-Agent": "DistributedRagScraper/0.1 (educational project)" },
    });
    const $ = cheerio.load(response.data);
    $("script, style, noscript").remove();
    const title = $("title").first().text().trim() || null;
    const extractedText = $("body").text().replace(/\s+/g, " ").trim();

    const page = await prisma.page.create({
      data: { crawlRunId, url, title, rawHtml: response.data, extractedText, statusCode: response.status },
    });
    await prisma.crawlRun.update({
      where: { id: crawlRunId },
      data: { status: CrawlStatus.COMPLETED, completedAt: new Date() },
    });
    return { pageId: page.id, title };
  },
  { connection: createRedisConnection(), concurrency: 2 },
);

worker.on("completed", (job, result) => console.log(`Completed job ${job.id}:`, result));
worker.on("failed", async (job, error) => {
  console.error(`Failed job ${job?.id}:`, error.message);
  if (job?.data.crawlRunId && job.attemptsMade >= (job.opts.attempts ?? 1)) {
    await prisma.crawlRun.update({
      where: { id: job.data.crawlRunId },
      data: { status: CrawlStatus.FAILED, error: error.message, completedAt: new Date() },
    });
  }
});

const shutdown = async () => {
  await worker.close();
  await prisma.$disconnect();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

