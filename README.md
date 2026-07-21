# Distributed RAG Web Scraper

An educational distributed web-scraping and RAG project. Day 1 implements the first complete path: API request → Redis/BullMQ job → scraper worker → PostgreSQL.

## Services

- **API** (`localhost:3000`): accepts crawl requests and exposes results.
- **Redis**: durable job queue backing BullMQ.
- **Scraper worker**: claims crawl jobs, downloads static HTML, extracts basic text, and persists it.
- **PostgreSQL**: stores crawl runs and raw/extracted page data.

## Start locally

1. Create a `.env` file from `.env.example` if running services outside Docker.
2. Start the stack: `docker compose up --build`.
3. In another terminal, create the database tables: `docker compose exec api npx prisma db push`.
4. Check `http://localhost:3000/health`.
5. Submit a permitted static URL:

   ```bash
   curl -X POST http://localhost:3000/crawl \
     -H 'content-type: application/json' \
     -d '{"url":"https://quotes.toscrape.com"}'
   ```

6. Copy the returned `crawlRunId` and view the result at `http://localhost:3000/crawl/<crawlRunId>`.

Only crawl pages whose robots rules and terms permit it. This first milestone does not yet implement robots checks, rate limiting, JavaScript rendering, or page discovery; those are Day 2 work.
