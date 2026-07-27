import { qdrant, COLLECTION_NAME } from "./qdrant.service.js";

export async function searchSimilarChunks(vector:number[]) {

    const result = await qdrant.search(
        COLLECTION_NAME,
        {
            vector,
            limit:5,
        }
    );

    result.map(item => ({
        score:item.score,
        ...item.payload,
    }));
}