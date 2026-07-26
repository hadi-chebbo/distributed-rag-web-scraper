import { detokenize,tokenize } from "./tokenizer.service";

const MAX_TOKENS = 500;
const OVERLAP = 100;

export function splitSection(heading: string | null, content: string) {
    const tokens = tokenize(content);

    const chunks: {
        heading: string | null;
        content: string;
        tokenCount: number;
    }[] = [];

    if(tokens.length <= MAX_TOKENS) {
        chunks.push({
            heading,
            content: heading
                ? `# ${heading}\n\n${content}` : content,
            tokenCount: tokens.length,
        });

        return chunks;
    }

    let start = 0;

    while (start < tokens.length) {
        const end = Math.min(
            start + MAX_TOKENS,
            tokens.length
        );

        const chunkTokens = tokens.slice(start, end);

        const chunkText = detokenize(chunkTokens);

        chunks.push({
            heading,
            content: heading
                ? `# ${heading}\n\n${chunkText}`
                : chunkText,
            tokenCount: chunkTokens.length,
        });

        if (end === tokens.length) {
            break;
        }

        start = end - OVERLAP;
    }

    return chunks;
}