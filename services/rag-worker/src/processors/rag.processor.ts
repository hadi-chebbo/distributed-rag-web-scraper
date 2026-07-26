import { ragJobSchema } from "@scraper/shared";
import { chunkContent } from "../services/chunking/chunker.service.js";
import { saveChunks } from "../services/page-chunk.service.js";


export async function processRagJob(job:any) {


    const data = ragJobSchema.parse(job.data);


    console.log(
        "Processing RAG page:",
        data.pageId
    );


    const chunks = chunkContent(
        data.content
    );


    await saveChunks(
        data.pageId,
        chunks
    );


    return {
        pageId:data.pageId,
        chunks:chunks.length
    };
}