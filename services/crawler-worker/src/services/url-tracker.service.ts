import { prisma } from "../db/prisma.js";
import { cacheUrl, isUrlCached } from "./url-cache.service.js";


export async function isUrlVisited(url: string) {
    const cached = await isUrlCached(url);

    if(cached) {
        return true;
    }
    const existing = await prisma.crawledUrl.findUnique({
                                where:{
                                    url
                                }
                            });
        

    if(existing) {
        return true;
    }

    return false;
}


export async function registerUrl(url: string, crawlRunId: string) {

    const result =  prisma.crawledUrl.create({
                        data:{
                            url,
                            crawlRunId
                        }
                    });

    await cacheUrl(url);

    return result;
}