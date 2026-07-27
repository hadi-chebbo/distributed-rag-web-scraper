import { QdrantClient } from "@qdrant/js-client-rest";
export const COLLECTION_NAME = "page_chunks";

export const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
});