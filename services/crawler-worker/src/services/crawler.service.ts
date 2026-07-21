import { crawlerJobSchema } from "@scraper/shared";


export async function crawlerService(job:any){

    const data =
        crawlerJobSchema.parse(job.data);


    console.log(
        "Crawling:",
        data.url
    );


    // later:
    // download HTML
    // extract links
    // send scraper jobs

}