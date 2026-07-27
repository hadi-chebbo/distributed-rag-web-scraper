import { qdrant, COLLECTION_NAME } from "./qdrant.service.js";


export interface RetrievedChunk {
    score: number;
    pageId: string;
    chunkId: string;
    content: string;
    chunkIndex: number;
    url?: string;
    title?: string;
}


export async function searchSimilarChunks(vector: number[]): Promise<RetrievedChunk[]> {

    const result = await qdrant.search(
        COLLECTION_NAME,
        {
            vector,
            limit: 5,
            with_payload: true,
        }
    );


    return result.map(item => ({
        score: item.score,

        pageId: item.payload?.pageId as string,
        chunkId: item.payload?.chunkId as string,
        content: item.payload?.content as string,
        chunkIndex: item.payload?.chunkIndex as number,

        url: item.payload?.url as string | undefined,
        title: item.payload?.title as string | undefined,
    }));
}