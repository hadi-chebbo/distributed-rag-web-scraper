import axios from "axios";
import * as robotsParserImport from "robots-parser";

const robotsParser = robotsParserImport as unknown as (
    url: string,
    contents: string
) => any;

const robotsCache = new Map<string, any>();

export async function isAllowed(url: string) {
    const parsedUrl = new URL(url);

    const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`;

    let robots = robotsCache.get(robotsUrl);

    if (!robots) {
        try {
            const response = await axios.get(robotsUrl);

            robots = robotsParser(
                robotsUrl,
                response.data
            );

            robotsCache.set(
                robotsUrl,
                robots
            );
        } catch {
            // No robots.txt = allowed
            return true;
        }
    }

    return robots.isAllowed(
        url,
        "DistributedRAGBOT"
    ) ?? true;
}