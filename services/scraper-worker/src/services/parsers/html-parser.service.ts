import * as cheerio from "cheerio";


export function parseHtml(html: string) {

    const $ = cheerio.load(html);


    // Remove useless content
    $("script, style, noscript").remove();


    const title =
        $("title")
            .first()
            .text()
            .trim() || null;



    /*
        Extract normal body text
    */
    const bodyText =
        $("body")
            .text()
            .replace(/\s+/g, " ")
            .trim();



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
    const links = $("a")
        .map((_, link) => {

            const text =
                $(link)
                    .text()
                    .replace(/\s+/g, " ")
                    .trim();


            const href =
                $(link)
                    .attr("href");


            if(!href) {
                return null;
            }


            return `${text} -> ${href}`;

        })
        .get()
        .filter(Boolean);



    /*
        Extract documents
    */
    const documents = links.filter(link =>
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i
            .test(link!)
    );



    /*
        Build RAG-friendly text
    */

    const extractedText = [
        
        bodyText
            ? `Content:\n${bodyText}`
            : "",


        tables.length
            ? `Tables:\n${tables.join("\n")}`
            : "",


        documents.length
            ? `Documents:\n${documents.join("\n")}`
            : "",


        links.length
            ? `Links:\n${links.join("\n")}`
            : ""

    ]
    .filter(Boolean)
    .join("\n\n");



    return {
        title,
        extractedText,
    };
}