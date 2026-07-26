export interface ParsedPageContent {

    title: string | null;

    sections: {
        heading: string | null;
        content: string;
    }[];

    tables: string[];

    links: {
        text: string;
        url: string;
    }[];

    documents: {
        text: string;
        url: string;
    }[];
}