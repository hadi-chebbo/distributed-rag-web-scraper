import robotsParser from "robot-txt-parser";

const robotsCache = new Map<string, any>();

const robots = robotsParser({
    userAgent: "DistributedRAGBOT",
    allowOnNeutral: true,
});

export async function isAllowed(url: string) {
    
    const parsedUrl = new URL(url);

    const domain = `${parsedUrl.protocol}//${parsedUrl.host}`;

    if(!robotsCache.has(domain)) {
        await robots.useRobotsFor(domain);

        robotsCache.set(
            domain,
            true
        );
    }

    return robots.canCrawl(url);
}