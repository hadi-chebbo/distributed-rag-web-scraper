import { generateQueryEmbedding } from "../services/query/query-embedding.service.js";
import { searchSimilarChunks } from "../services/vector/search.service.js";
import { generateLLMResponse } from "../services/llm/llm.service.js";

export async function processQueryJob(job:any) {
    const { question } = job.data;

    console.log(
        "Processing query:",
        question
    );

    const queryVector = await generateQueryEmbedding(
        question
    );

    const similarChunks = await searchSimilarChunks(
        queryVector
    );

    const llmResponse = await generateLLMResponse(
        question,
        similarChunks
    );

    return {
        question,
        answer: llmResponse,
        context: similarChunks,

        sources: similarChunks.map(chunk => ({
            url: chunk.url,
            title: chunk.title,
            score: chunk.score,
        })),
    };
}