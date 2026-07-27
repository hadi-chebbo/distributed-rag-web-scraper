import { Ollama } from "ollama";

const ollama = new Ollama({
    host: process.env.OLLAMA_URL,
})

const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateQueryEmbedding(query: string) {
    const response = await ollama.embed({
        model: EMBEDDING_MODEL,
        input: query,
    });

    return response.embeddings[0];
}