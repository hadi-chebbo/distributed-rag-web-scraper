import { QdrantClient } from "@qdrant/js-client-rest";
import { v5 as uuidv5 } from "uuid";

const QDRANT_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

export const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
});

export const COLLECTION_NAME = "page_chunks";

export async function ensureCollection() {

    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
        collection => collection.name === COLLECTION_NAME
    );


    if (exists) {
        return;
    }


    await qdrant.createCollection(
        COLLECTION_NAME,
        {
            vectors: {
                size: 768,
                distance: "Cosine",
            },
        }
    );


    console.log(
        `Created Qdrant collection: ${COLLECTION_NAME}`
    );
}

export async function storeEmbeddings(
    points: {
        id: string;
        vector: number[];
        payload: {
            pageId: string;
            url: string;
            title: string | null;
            content: string;
            chunkIndex: number;
        };
    }[]
) {

    if(points.length == 0) {
        console.log("No embeddings to store");
        return;
    }

    await qdrant.upsert(
        COLLECTION_NAME,
        {
            wait: true,

            points: points.map(point => ({
                id: uuidv5(point.id, QDRANT_NAMESPACE),

                vector: point.vector,

                payload: {
                    pageId: point.payload.pageId,
                    chunkId: point.id,
                    url: point.payload.url,
                    title: point.payload.title,
                    content: point.payload.content,
                    chunkIndex: point.payload.chunkIndex,
                },
            })),
        }
    );


    console.log(
        `Stored ${points.length} vectors in Qdrant`
    );
}