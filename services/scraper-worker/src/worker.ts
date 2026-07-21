import { Worker } from "bullmq";
import { SCRAPER_QUEUE } from "@scraper/shared";
import { scraperService } from "./services/scraper.service.js";
import { redis } from "./redis/connection.js";


const worker = new Worker(
    SCRAPER_QUEUE,
    async(job)=>{
      return scraperService(job.data);
    },
    {
      connection: redis
    }
);

worker.on("completed", (job, result) => {
    console.log(
        `Scraper job ${job.id} completed`,
        result
    );
});


worker.on("failed", (job, error) => {
    console.error(
        `Scraper job ${job?.id} failed`,
        error.message
    );
});


const shutdown = async () => {
    await worker.close();
    await redis.quit();
    process.exit(0);
};


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);