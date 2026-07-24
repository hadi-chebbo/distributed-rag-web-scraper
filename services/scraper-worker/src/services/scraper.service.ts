import { scraperJobSchema } from "@scraper/shared";
import { fetchPage } from "./fetchers/fetch-strategy.service.js";
import { parseHtml } from "./parsers/html-parser.service.js";
import { findPageByUrl, savePage, savePageVersion, updatePage } from "./page.service.js";
import crypto from "crypto";


export async function scraperService(job: unknown) {
    const data = scraperJobSchema.parse(job);
    let pageData;

    try {
        pageData = await fetchPage(data.url);
    } catch(error) {

        console.error("Failed fetching: ", data.url, error);
        throw error;
    }
    

    const parsedPage = parseHtml(
        pageData.html
    );

    const contentHash = crypto
        .createHash("sha256")
        .update(parsedPage.extractedText)
        .digest("hex");


    const existingPage = await findPageByUrl(data.url);


    if(existingPage) {

        if(existingPage.contentHash === contentHash) {

            console.log(
                "No changes:",
                data.url
            );

            return existingPage;
        }


        console.log(
            "Content changed:",
            data.url
        );


        await savePageVersion({
            pageId: existingPage.id,
            contentHash: existingPage.contentHash!,
            rawHtml: existingPage.rawHtml,
            extractedText: existingPage.extractedText,
        });


        return updatePage(
            existingPage.id,
            {
                title: parsedPage.title ?? "",
                rawHtml: pageData.html,
                extractedText: parsedPage.extractedText,
                contentHash,
                statusCode: pageData.statusCode,
                fetchedAt: new Date()
            }
        );
    }


    console.log(
        "New page:",
        data.url
    );

    console.log("Generated hash:", contentHash);

    return savePage({
        crawlRunId: data.crawlRunId,
        url: data.url,
        title: parsedPage.title,
        rawHtml: pageData.html,
        extractedText: parsedPage.extractedText,
        contentHash,
        statusCode: pageData.statusCode
    });
}