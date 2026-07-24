import { fetchWithHttp } from "./http-fetcher.service.js";
import { fetchPageWithBrowser } from "./browser-fetcher.service.js";

function isDynamicPage(html: string): boolean {
    const indicators = [
        '<div id="root">',
        '<div id="app">',
        '__NEXT_DATA__',
        'webpack',
        'vite',
        'ng-version'
    ];

    return indicators.some(
        indicator => html.includes(indicator)
    );
}

export async function fetchPage(url: string) {

    const httpResult = await fetchWithHttp(url);

    if(isDynamicPage(httpResult.html)) {
        console.log(
            "Dynamic website url detected, using browser: ",
            url
        );

        return fetchPageWithBrowser(url);
    }

    console.log(
        "Static website url detected, using HTTP: ",
        url
    );

    return httpResult;
}