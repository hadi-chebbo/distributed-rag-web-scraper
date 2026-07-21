import { Worker } from "bullmq";
import { CRAWLER_QUEUE } from "@scraper/shared";
import { redis } from "./redis/connection.js";

const worker = new Worker(
  CRAWLER_QUEUE,
  async (job) => {
    console.log("Received crawler job:", job.data);
  },
  {
    connection: redis
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});