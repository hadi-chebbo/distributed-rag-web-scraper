import { prisma } from "../db/prisma";

export async function saveChunks(pageId: string, chunks:{
    content:string;
    chunkIndex:number;
    tokenCount:number;
}[]) {
    return prisma.pageChunk.createMany({
        data: chunks.map(chunk => ({
            pageId,
            ...chunk
        }))
    });
}