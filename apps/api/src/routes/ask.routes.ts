import { FastifyInstance } from "fastify";
import { askController } from "../controllers/ask.controller.js";

export async function askRoutes(app: FastifyInstance) {
    app.post("/ask", askController);
}