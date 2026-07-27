import { generateQueryEmbedding } from "./embedding/query-embedding.service.js";
import { searchSimilarChunks } from "./vector/search.service.js";
import { generateLLMResponse } from "./llm/llm.service.js";


export async function answerQuestion(question:string) {

    const queryVector =
        await generateQueryEmbedding(question);


    const similarChunks =
        await searchSimilarChunks(
            queryVector
        );


    const answer =
        await generateLLMResponse(
            question,
            similarChunks
        );


    return {
        question,
        answer,
        context: similarChunks,
        sources: similarChunks.map(chunk => ({
            url: chunk.url,
            title: chunk.title,
            score: chunk.score,
        })),
    };
}