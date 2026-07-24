declare module "robot-txt-parser" {
    interface RobotsParserOptions {
        userAgent?: string;
        allowOnNeutral?: boolean;
    }

    interface RobotsParser {
        useRobotsFor(url: string): Promise<void>;
        canCrawl(url: string): boolean;
    }

    function robotsParser(
        options?: RobotsParserOptions
    ): RobotsParser;

    export default robotsParser;
}