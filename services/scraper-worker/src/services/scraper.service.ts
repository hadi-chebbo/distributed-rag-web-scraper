import { scraperJobSchema } from "@scraper/shared";
import { fetchPage } from "./page-fetcher.service.js";
import { parseHtml } from "./html-parser.service.js";
import { savePage } from "./page.service.js";


export async function scraperService(job: unknown) {
    const data = scraperJobSchema.parse(job);


    const pageData = await fetchPage(data.url);


    const parsedPage = parseHtml(
        pageData.html
    );


    const page = await savePage({
        crawlRunId: data.crawlRunId,
        url: data.url,
        title: parsedPage.title,
        extractedText: parsedPage.extractedText,
        rawHtml: pageData.html,
        statusCode: pageData.statusCode,
    });


    return page;
}