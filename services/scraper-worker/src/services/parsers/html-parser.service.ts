import * as cheerio from "cheerio";


export interface ParsedPage {

    title: string | null;

    extractedText: string;

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



export function parseHtml(
    html: string
): ParsedPage {


    const $ = cheerio.load(html);


    /*
        Remove useless content
    */
    $("script, style, noscript, nav, footer, aside")
        .remove();



    /*
        Page title
    */
    const title =
        $("title")
            .first()
            .text()
            .trim() || null;



    /*
        Extract semantic sections
        based on headings
    */
    const sections: ParsedPage["sections"] = [];


    $("h1, h2, h3").each((_, element) => {


        const heading =
            $(element)
                .text()
                .replace(/\s+/g, " ")
                .trim();



        let content = "";



        $(element)
            .nextUntil("h1, h2, h3")
            .each((_, child) => {

                content +=
                    $(child)
                        .text()
                        .replace(/\s+/g, " ")
                        .trim()
                    + " ";

            });



        content = content.trim();



        if(content) {

            sections.push({
                heading,
                content
            });

        }

    });



    /*
        Extract tables
    */
    const tables = $("table")
        .map((_, table) => {


            const rows = $(table)
                .find("tr")
                .map((_, row) => {

                    return $(row)
                        .find("th, td")
                        .map((_, cell) =>
                            $(cell)
                                .text()
                                .replace(/\s+/g, " ")
                                .trim()
                        )
                        .get()
                        .join(" | ");

                })
                .get();



            return rows.join("\n");


        })
        .get();



    /*
        Extract links
    */
    const links: ParsedPage["links"] =
        $("a")
            .map((_, link) => {


                const text =
                    $(link)
                        .text()
                        .replace(/\s+/g, " ")
                        .trim();



                const url =
                    $(link)
                        .attr("href");



                if(!url) {
                    return null;
                }



                return {
                    text,
                    url
                };

            })
            .get()
            .filter(Boolean);



    /*
        Extract downloadable documents
    */
    const documents =
        links.filter(link =>
            /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i
                .test(link.url)
        );



    /*
        Build plain text version
        This is what stays in Page table
    */
    const extractedText = [

        title
            ? `Title:\n${title}`
            : "",


        sections.length
            ? sections.map(section =>
                `${section.heading ?? ""}
${section.content}`
            ).join("\n\n")
            : "",


        tables.length
            ? `Tables:\n${tables.join("\n")}`
            : "",


        documents.length
            ? `Documents:\n${
                documents
                    .map(doc =>
                        `${doc.text} -> ${doc.url}`
                    )
                    .join("\n")
            }`
            : "",


        links.length
            ? `Links:\n${
                links
                    .map(link =>
                        `${link.text} -> ${link.url}`
                    )
                    .join("\n")
            }`
            : ""

    ]
    .filter(Boolean)
    .join("\n\n");



    return {
        title,
        extractedText,
        sections,
        tables,
        links,
        documents
    };
}