import { prisma } from "../db/prisma.js";

export async function saveChunks(
    pageId: string,
    chunks: {
        content: string;
        chunkIndex: number;
        tokenCount: number;
    }[]
) {

    await prisma.pageChunk.createMany({
        data: chunks.map(chunk => ({
            pageId,
            ...chunk
        }))
    });


    return prisma.pageChunk.findMany({
        where: {
            pageId
        },
        orderBy: {
            chunkIndex: "asc"
        }
    });
}