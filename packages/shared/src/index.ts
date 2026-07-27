import { Queue } from "bullmq";
import { QueueEvents } from "bullmq";
import { Redis } from "ioredis";
import { z } from "zod";
import { ragJobSchema } from "./schemas/rag.schema.js";
import { askRequestSchema } from "./schemas/query.schema.js";

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

export const RAG_QUEUE = "rag";
export type RagJob = z.infer<typeof ragJobSchema>;

export function createRagQueue() {
  return new Queue<RagJob>(RAG_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    }
  });
}

export const QUERY_QUEUE = "query";
export type QueryJob = z.infer<typeof askRequestSchema>;

export function createQueryQueue() {
  return new Queue<QueryJob>(QUERY_QUEUE, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: false,
    }
  });
}

export function createQueryQueueEvents() {
  return new QueueEvents(QUERY_QUEUE, {
    connection: createRedisConnection(),
  });
}

export * from "./parser/html-parser.js";
export * from "./schemas/rag.schema.js"
export * from "./types/content.js"