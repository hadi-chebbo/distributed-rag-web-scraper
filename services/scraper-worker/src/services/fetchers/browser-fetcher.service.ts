import { chromium } from "playwright";
import { getBrowser,closeBrowser } from "../../browser/playwright.js";

export async function fetchPageWithBrowser(url: string) {

    const broswer = await getBrowser();

    try {

        const page = await broswer.newPage({
            userAgent: "DistributedRAGBOT/1.0",
        });

        await page.goto(url, {
            waitUntil: "networkidle",
            timeout: 30000,
        });

        const html = await page.content();

        const title = await page.title();

        return {
            html,
            title,
            statusCode: 200,
        };
    } finally {

        await closeBrowser();
    }
}