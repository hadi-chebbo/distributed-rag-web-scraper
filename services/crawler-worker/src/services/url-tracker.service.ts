import { prisma } from "../db/prisma.js";


export async function isUrlVisited(url: string) {
    const existing = await prisma.crawledUrl.findUnique({
                                where:{
                                    url
                                }
                            });
        

    return !!existing;
}


export async function registerUrl(url: string, crawlRunId: string) {

    return prisma.crawledUrl.create({
        data:{
            url,
            crawlRunId
        }
    });

}