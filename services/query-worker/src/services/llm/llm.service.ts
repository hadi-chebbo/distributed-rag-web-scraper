import { Ollama } from "ollama";

const ollama = new Ollama({
    host: process.env.OLLAMA_URL,
});

const LLM_MODEL = "llama3.1";
const MAX_CHUNKS = 5;

type RetrievedChunk = {
    content: string;
    url?: string | null;
    title?: string | null;
};

export async function generateLLMResponse(question: string,context: RetrievedChunk[]) {
    if (context.length === 0) {
        return "I don't have enough information.";
    }

    const formattedContext = context
        .slice(0, MAX_CHUNKS)
        .map((chunk, index) => `
    Source ${index + 1}

    Title: ${chunk.title ?? "Unknown"}

    URL: ${chunk.url ?? "Unknown"}

    Content:
    ${chunk.content}
    `)
            .join("\n");

    const prompt = `
You are a helpful AI assistant.

Use ONLY the information in the provided context.

Rules:
- Do not invent information.
- If the answer cannot be found in the context, respond exactly:
"I don't have enough information."
- Combine information from multiple sources when helpful.

Context:
${formattedContext}

Question:
${question}

Answer:
`;

    const response = await ollama.generate({
        model: LLM_MODEL,
        prompt,
        options: {
            temperature: 0,
        },
    });

    return response.response.trim();
}