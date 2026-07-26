import { QdrantClient } from "@qdrant/js-client-rest";

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
            content: string;
            chunkIndex: number;
        };
    }[]
) {

    await qdrant.upsert(
        COLLECTION_NAME,
        {
            wait: true,

            points: points.map(point => ({
                id: point.id,

                vector: point.vector,

                payload: {
                    pageId: point.payload.pageId,
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