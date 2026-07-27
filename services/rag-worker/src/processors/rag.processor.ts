import { ragJobSchema } from "@scraper/shared";
import { chunkContent } from "../services/chunking/chunker.service.js";
import { saveChunks } from "../services/page-chunk.service.js";
import { generateEmbeddings } from "../services/embeddings/embedding.service.js";
import { storeEmbeddings } from "../services/vector/qdrant.service.js";

export async function processRagJob(job:any) {


    const data = ragJobSchema.parse(job.data);


    console.log(
        "Processing RAG page:",
        data.pageId
    );


    const chunks = chunkContent(
        data.content
    );


    const savedChunks = await saveChunks(
        data.pageId,
        chunks
    );

    const vectors = await generateEmbeddings(
        savedChunks.map(
            chunk => chunk.content
        )
    )

    await storeEmbeddings(
        savedChunks.map((chunk, index) => ({

            id: chunk.id,

            vector: vectors[index],

            payload: {
                pageId: data.pageId,
                url: data.url,
                title: data.title,
                content: chunk.content,
                chunkIndex: chunk.chunkIndex,
            },

        }))
    );

    console.log(
        `Stored ${savedChunks.length} embeddings`
    )


    return {
        pageId:data.pageId,
        chunks:chunks.length
    };
}