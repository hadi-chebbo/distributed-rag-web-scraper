import { Worker } from "bullmq";
import { CRAWL_QUEUE, createRedisConnection } from "@scraper/shared";
import { processCrawlJob } from "./processors/crawl.processor.js";
import { shutdown } from "./shutdown.js";


const worker = new Worker(
  CRAWL_QUEUE,
  processCrawlJob,
  {
    connection: createRedisConnection(),
    concurrency: 2,
  }
);


worker.on(
  "completed",
  (job, result) => {
    console.log(
      `Completed job ${job.id}:`,
      result
    );
  }
);


worker.on(
  "failed",
  (job, error) => {
    console.error(
      `Failed job ${job?.id}:`,
      error.message
    );
  }
);


process.on(
  "SIGINT",
  async () => {
    await worker.close();
    await shutdown();
    process.exit(0);
  }
);


process.on(
  "SIGTERM",
  async () => {
    await worker.close();
    await shutdown();
    process.exit(0);
  }
);