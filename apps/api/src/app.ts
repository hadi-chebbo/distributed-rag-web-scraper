import Fastify from "fastify";
import { healthRoutes } from "./routes/health.routes.js";
import { crawlRoutes } from "./routes/crawl.routes.js";

export function buildApp() {
    const app = Fastify({
        logger: true,
    });

    app.register(healthRoutes);
    app.register(crawlRoutes);

    return app;
}