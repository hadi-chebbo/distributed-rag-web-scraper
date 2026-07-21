import { PrismaClient } from "@prisma/client";
import { createCrawlQueue } from "@scraper/shared";
import Fastify from "fastify";
import { z } from "zod";

const app = Fastify({ logger: true });
const prisma = new PrismaClient();
const crawlQueue = createCrawlQueue();

app.get("/health", async () => ({ status: "ok" }));

app.post("/crawl", async (request, reply) => {
  const input = z.object({ url: z.string().url() }).safeParse(request.body);
  if (!input.success) {
    return reply.code(400).send({ error: "Please provide a valid URL." });
  }

  const crawlRun = await prisma.crawlRun.create({ data: { startUrl: input.data.url } });
  const job = await crawlQueue.add("fetch-page", {
    crawlRunId: crawlRun.id,
    url: input.data.url,
  });

  return reply.code(202).send({ crawlRunId: crawlRun.id, jobId: job.id, status: "QUEUED" });
});

app.get("/crawl/:id", async (request, reply) => {
  const params = z.object({ id: z.string() }).parse(request.params);
  const crawlRun = await prisma.crawlRun.findUnique({
    where: { id: params.id },
    include: { pages: { orderBy: { fetchedAt: "desc" } } },
  });
  if (!crawlRun) return reply.code(404).send({ error: "Crawl run not found." });
  return crawlRun;
});

const start = async () => {
  await app.listen({ host: "0.0.0.0", port: Number(process.env.PORT ?? 3000) });
};

start().catch(async (error) => {
  app.log.error(error);
  await prisma.$disconnect();
  process.exit(1);
});

