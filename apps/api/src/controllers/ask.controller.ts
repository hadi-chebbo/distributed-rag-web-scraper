import { FastifyRequest, FastifyReply } from "fastify";
import { createQueryJob } from "../services/query.service.js";
import { askRequestSchema } from "../schemas/askRequest.schema.js";

export async function askController(request: FastifyRequest, reply: FastifyReply) {
    const { question } = askRequestSchema.parse(request.body);

    if (!question) {
        return reply.code(400).send({
            error: "Question is required.",
        });
    }

    try {
        const result = await createQueryJob(question);
        return reply.code(200).send(result);
    } catch (error) {
        console.error("Error processing question:", error);
        return reply.code(500).send({
            error: "An error occurred while processing the question.",
        });
    }
}