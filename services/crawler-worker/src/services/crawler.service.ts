import { crawlerJobSchema } from "@scraper/shared";
import { fetchPage } from "./page-fetcher.js";
import { parseHtml } from "@scraper/shared";
import { extractLinks } from "./link-extractor.service.js";
import { scraperQueue } from "../queues/scraper.queue.js";
import { isUrlVisited, registerUrl } from "./url-tracker.service.js";
import { isAllowed } from "./robots.service.js";

export async function crawlerService(job:any){

    const data = crawlerJobSchema.parse(job.data);

    const html = await fetchPage(data.url);

    const $ = parseHtml(html);

    console.log(
        "Crawling:",
        data.url
    );

    const links = extractLinks($, data.url);

    console.log(
        "Found links: ",
        links.length,
    );

    for (const link of links) {

        const allowed = await isAllowed(link);

        if(!allowed) {
            
            console.log(
                "Blocked by robots.txt",
                link
            );

            continue;
        }

        const visited = await isUrlVisited(link,data.crawlRunId);

        if(visited) {
            console.log("Skipping visited: ", link);
            continue;
        }

        await registerUrl(link,data.crawlRunId);

        console.log("Adding scraper job:", link);

        const scraperJob = await scraperQueue.add("scrape", {
            crawlRunId: data.crawlRunId,
            url: link
        });

        console.log("Added job id:", scraperJob.id);
    }
}