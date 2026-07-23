import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { z } from "zod";

export function createRedisConnection() {
  return new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });
}

export const CRAWLER_QUEUE = "crawler";

export const crawlerJobSchema = z.object({
  crawlRunId: z.string().min(1),
  url: z.string().url(),
});

export type CrawlerJob = z.infer<typeof crawlerJobSchema>;


export function createCrawlerQueue() {
  return new Queue<CrawlerJob>(CRAWLER_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    },
  });
}

export const SCRAPER_QUEUE = "scraper";

export const scraperJobSchema = z.object({
  crawlRunId: z.string().min(1),
  url: z.string().url(),
});

export type ScraperJob = z.infer<typeof scraperJobSchema>;

export function createScraperQueue() {
  return new Queue<ScraperJob>(SCRAPER_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    },
  });
}

export * from "./parser/html-parser.js";