import { Worker } from "bullmq";
import { CRAWLER_QUEUE } from "@scraper/shared";
import { redis } from "./redis/connection.js";
import { crawlerService } from "./services/crawler.service.js";

const worker = new Worker(
  CRAWLER_QUEUE,
  async (job) => {
    console.log("JOB RECEIVED:",job.data);

    return crawlerService(job);
  },
  {
    connection: redis
  }
);

worker.on("ready", ()=>{
    console.log("Crawler worker ready");
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});