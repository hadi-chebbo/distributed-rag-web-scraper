import * as cheerio from "cheerio";

export function parseHtml(html: string) {
    const $ = cheerio.load(html);

    $("script", "style", "noscript").remove();

    const title = $("title").first().text().trim() || null;

    const extractedText = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();
    
    return {
        title,
        extractedText,
    };
}