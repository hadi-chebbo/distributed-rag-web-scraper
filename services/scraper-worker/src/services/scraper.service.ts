import { scraperJobSchema } from "@scraper/shared";
import { fetchPage } from "./page-fetcher.service.js";
import { parseHtml } from "./html-parser.service.js";
import { findPageByHash, savePage } from "./page.service.js";
import crypto from "crypto";


export async function scraperService(job: unknown) {
    const data = scraperJobSchema.parse(job);


    const pageData = await fetchPage(data.url);


    const parsedPage = parseHtml(
        pageData.html
    );

    const contentHash = crypto
                            .createHash("sha256")
                            .update(parsedPage.extractedText)
                            .digest("hex");

    const existingPage = await findPageByHash(contentHash);

    if(existingPage) {
        console.log("Duplicate content detected");
        return existingPage;
    }

    const page = await savePage({
        crawlRunId: data.crawlRunId,
        url: data.url,
        title: parsedPage.title,
        extractedText: parsedPage.extractedText,
        rawHtml: pageData.html,
        contentHash: contentHash,
        statusCode: pageData.statusCode,
    });

    return page;
}