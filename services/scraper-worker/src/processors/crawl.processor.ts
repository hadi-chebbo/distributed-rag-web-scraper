import { CrawlStatus } from "@prisma/client";
import { crawlJobSchema, } from "@scraper/shared";
import { fetchPage } from "../services/page-fetcher.service.js";
import { parseHtml } from "../services/html-parser.service.js";
import { markCrawlCompleted, markCrawlFailed, markCrawlRunning, savePage } from "../services/page.service.js";

export async function processCrawlJob(job: any) {
    const { crawlRunId, url } = crawlJobSchema.parse(job.data);

    await markCrawlRunning(crawlRunId);

    const { html, statusCode } = await fetchPage(url);

    const { title, extractedText } = await parseHtml(html);

    const page = await savePage({
        crawlRunId,
        url,
        title,
        rawHtml: html,
        extractedText,
        statusCode,
    });

    await markCrawlCompleted(crawlRunId);

    return {
        pageId: page.id,
        title,
    };
}