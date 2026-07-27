import { queryQueue,queryQueueEvents } from "../queues/query.queue.js";

export async function createQueryJob(question: string) {
    const job = await queryQueue.add("query", { question });
    
    const result = await job.waitUntilFinished(queryQueueEvents, 60000); // Wait for a maximum of 60 seconds

    return result;
}