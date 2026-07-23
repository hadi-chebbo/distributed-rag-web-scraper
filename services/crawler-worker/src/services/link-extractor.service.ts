import * as cheerio from "cheerio";

export function extractLinks($: cheerio.CheerioAPI, baseUrl: string) {
    const links = new Set<string>();

    $("a[href]").each((_, element) => {
        const href = $((element)).attr("href");

        if(!href) {
            return;
        }

        try {
            links.add(new URL(href, baseUrl).toString());
        } catch {}
    });

    return [...links];
}