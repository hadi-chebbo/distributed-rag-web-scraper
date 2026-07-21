import { FastifyReply,FastifyRequest } from "fastify";
import { crawlSchema } from "../schemas/crawl.schema.js";
import { createCrawlRun, getCrawlRun } from "../services/crawl.service.js";

export async function createCrawl(request: FastifyRequest, reply: FastifyReply) {
    const input = crawlSchema.safeParse(request.body);

    if(!input.success) {
        return reply.code(400).send({
            error: "Please provide a valid URL.",
        });
    }

    const { crawlRun, job } = await createCrawlRun(input.data.url);

    return reply.code(200).send({
        crawlRunId: crawlRun.id,
        jobId: job.id,
        status: crawlRun.status,
    });
}

export async function getCrawl(request: FastifyRequest, reply:FastifyReply) {
    const { id } = request.params as { id:string };

    const crawlRun = await getCrawlRun(id);

    if(!crawlRun) {
        return reply.code(404).send({
            error: "Crawl run not found.",
        });
    }
    return reply.send(crawlRun);
}