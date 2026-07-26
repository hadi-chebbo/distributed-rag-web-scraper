import { Ollama } from "ollama";

const ollama = new Ollama({
    host: process.env.OLLAMA_URL,
});

const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateEmbedding(text: string) {
    const response = await ollama.embed({
        model: EMBEDDING_MODEL,
        input: text,
    });

    return response.embeddings[0];
}

export async function generateEmbeddings(texts: string[]) {
    const response = await ollama.embed({
        model: EMBEDDING_MODEL,
        input: texts,
    });

    return response.embeddings;
}