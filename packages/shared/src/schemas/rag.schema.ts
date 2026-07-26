import { z } from "zod";


export const ragJobSchema = z.object({

    pageId: z.string(),

    content: z.object({

        title: z.string().nullable(),

        sections: z.array(
            z.object({
                heading: z.string().nullable(),
                content: z.string()
            })
        ),

        tables: z.array(z.string()),

        links: z.array(
            z.object({
                text: z.string(),
                url: z.string()
            })
        ),

        documents: z.array(
            z.object({
                text: z.string(),
                url: z.string()
            })
        )

    })

});