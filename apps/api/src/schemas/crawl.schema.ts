import { z } from "zod";

export const crawlSchema = z.object({
    url: z.string().url(),
});

export type crawlInput = z.infer<typeof crawlSchema>;