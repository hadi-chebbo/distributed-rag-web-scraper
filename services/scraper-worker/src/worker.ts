import { Worker } from "bullmq";
import { SCRAPER_QUEUE } from "@scraper/shared";
import { scraperService } from "./services/scraper.service.js";
import { redis } from "./redis/connection.js";


const worker = new Worker(
    SCRAPER_QUEUE,
    async(job)=>{

        console.log(
            "Processing scraper job:",
            job.id,
            job.data
        );

      try {

            const result = await scraperService(job.data);

            console.log(
                "Scraper service finished:",
                job.id
            );

            return result;

        } catch(error){

            console.error(
                "Scraper service error:",
                job.id,
                error
            );

            throw error;
        }
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

    console.log("Shutting down scraper worker...");

    await worker.close();
    await redis.quit();
    process.exit(0);
};


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);