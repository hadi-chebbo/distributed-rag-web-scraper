import { tokenize,detokenize } from "./tokenizer.service";

interface Chunk {
    content: string,
    chunkIndex: number,
    tokenCount: number,
}

export function chunkText(text: string, chunkSize = 500, overlap = 100): Chunk[] {

    const tokens = tokenize(text);

    const chunks:Chunk[] = [];

    let start = 0;
    let chunkIndex = 0;

    while(start < tokens.length) {

        const end = Math.min(start+chunkSize, tokens.length);

        const chunkTokens = tokens.slice(start,end);

        chunks.push({
            content: detokenize(chunkTokens),
            chunkIndex,
            tokenCount: chunkTokens.length
        });


        chunkIndex++;


        start += chunkSize - overlap;
    }

    return chunks;
}