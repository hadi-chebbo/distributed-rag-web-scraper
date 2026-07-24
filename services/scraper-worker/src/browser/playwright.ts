import { chromium,Browser } from "playwright";

let broswer: Browser | null = null;

export async function getBrowser() {

    if(!broswer) {
        broswer = await chromium.launch({
            headless: true,
        });

        console.log(
            "Playwright browser started"
        );
    }

    return broswer;
}

export async function closeBrowser() {

    if(broswer) {
        await broswer.close();

        broswer = null;

        console.log(
            "Playwright browser closed"
        );
    }
}