import { Worker } from "bullmq";
import { redis } from "./redis/connection.js";
import { processRagJob } from "./processors/rag.processor.js";

const worker = new Worker(
    "rag",
    async(job) => {

        console.log(
            "Received RAG job: ",
            job.id,
        );

        return processRagJob(job);
    },
    {
        connection: redis,
    }
);


worker.on("completed", (job) => {
    console.log(
        `RAG job completed: ${job.id}`
    );
});

worker.on("failed", (job, error) => {
    console.error(
        `RAG job failed: ${job?.id}`,
        error
    );
});


console.log("RAG worker started");