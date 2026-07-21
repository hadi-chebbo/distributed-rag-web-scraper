import { FastifyInstance } from "fastify";
import { createCrawl, getCrawl } from "../controllers/crawl.controller.js";

export async function crawlRoutes(app: FastifyInstance) {
    app.post("/crawl", createCrawl);
    app.get("/crawl/:id", getCrawl);
}