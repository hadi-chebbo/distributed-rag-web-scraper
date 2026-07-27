import { Worker } from "bullmq";
import { redis } from "./redis/connection.js";
import { processQueryJob } from "./processors/query.processor.js";

const worker = new Worker(
    "query",
    async (job) => {
        console.log(`Processing job ${job.id}`);
        return await processQueryJob(job);
    },
    { connection: redis }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

worker.on("ready", () => {
    console.log("Query worker is ready and listening for jobs...");
});