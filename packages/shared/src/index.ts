import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { z } from "zod";

export const CRAWL_QUEUE = "crawl";

export const crawlJobSchema = z.object({
  crawlRunId: z.string().min(1),
  url: z.string().url(),
});

export type CrawlJob = z.infer<typeof crawlJobSchema>;

export function createRedisConnection() {
  return new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
    maxRetriesPerRequest: null,
  });
}

export function createCrawlQueue() {
  return new Queue<CrawlJob>(CRAWL_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 1_000 },
      removeOnComplete: 100,
      removeOnFail: false,
    },
  });
}
