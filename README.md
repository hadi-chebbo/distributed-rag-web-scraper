# Distributed RAG-Based Web Scraper Framework

A distributed, fault-tolerant web crawling and scraping framework built with TypeScript, BullMQ, Redis, PostgreSQL, Prisma, and Retrieval-Augmented Generation (RAG).

The system is designed to crawl websites at scale, extract and process content, store structured data, and prepare it for AI-powered retrieval.

---

## Architecture

The system follows a distributed worker architecture:

```
                    User
                     |
                     |
                  API Service
                     |
                     |
              Crawler Queue
                     |
                     |
              Crawler Worker
                     |
          discovers website URLs
                     |
                     |
              Scraper Queue
                     |
                     |
              Scraper Worker
                     |
          fetch + parse + store
                     |
                     |
                PostgreSQL
```

---

# Main Components

## API Service

Responsible for:

- Receiving crawl requests
- Creating crawl runs
- Managing crawl status
- Returning crawl results

Example:

```
POST /crawl

{
  "url": "https://example.com"
}
```

---

## Crawler Worker

Responsible for discovering pages inside a website.

Responsibilities:

- Visit starting URL
- Extract internal links
- Normalize URLs
- Prevent duplicate crawling
- Create scraper jobs

The crawler does not store page content.
Its only responsibility is discovering what needs to be scraped.

---

## Scraper Worker

Responsible for processing individual pages.

Responsibilities:

- Download HTML
- Parse content
- Extract metadata
- Store pages in the database

Current pipeline:

```
URL
 |
 v
Page Fetcher
 |
 v
HTML Parser
 |
 v
Database Storage
```

---

# Static and Dynamic Website Support

The framework supports two scraping engines.

## Static Websites

Using:

- Axios
- Cheerio

Suitable for:

- Documentation websites
- Blogs
- Simple HTML pages

Flow:

```
URL
 |
Axios
 |
HTML
 |
Cheerio
 |
Content
```

---

## Dynamic Websites

Using:

- Playwright

Supports:

- JavaScript-rendered pages
- Single Page Applications
- Client-side generated content

Flow:

```
URL
 |
Browser
 |
JavaScript Execution
 |
Rendered HTML
 |
Parser
 |
Storage
```

---

# Technology Stack

## Backend

- TypeScript
- Node.js
- Fastify

## Queue System

- Redis
- BullMQ

## Database

- PostgreSQL
- Prisma ORM

## Scraping

Static:

- Axios
- Cheerio

Dynamic:

- Playwright

## AI / RAG

Planned:

- Text chunking
- Embeddings
- Vector database
- Retrieval pipeline

---

# Project Structure

```
.
├── apps
│   └── api
│
├── services
│   ├── crawler-worker
│   └── scraper-worker
│
├── packages
│   └── shared
│
├── prisma
│
├── docker-compose.yml
└── README.md
```

---

# Running the Project

## Install dependencies

```
npm install
```

---

## Start infrastructure

```
docker compose up -d
```

Starts:

- PostgreSQL
- Redis

---

## Run database migrations

```
npx prisma migrate dev
```

---

## Start API

```
npm run dev --workspace api
```

---

## Start crawler worker

```
npm run dev --workspace crawler-worker
```

---

## Start scraper worker

```
npm run dev --workspace scraper-worker
```

---

# Development Roadmap

## Completed

- Monorepo architecture
- API service
- Database integration
- Redis queues
- BullMQ workers
- Scraper worker separation
- HTML extraction pipeline

---

## In Progress

- Crawler worker implementation
- URL discovery
- URL deduplication
- Crawl boundaries

---

## Planned

- Dynamic website scraping
- Distributed scaling
- Monitoring
- Vector database integration
- RAG question answering system

---

# Design Principles

## Separation of Responsibilities

Each component has one responsibility:

API:
> Accept requests

Crawler:
> Discover URLs

Scraper:
> Extract page data

RAG:
> Understand and retrieve information


## Fault Tolerance

The system uses:

- Queue retries
- Worker isolation
- Persistent jobs
- Failure tracking


## Scalability

Workers can be horizontally scaled:

```
Crawler Worker x N

Scraper Worker x N
```

allowing the system to process many websites concurrently.

---

# Future Vision

The final goal is a complete AI-powered web intelligence platform:

1. Crawl websites
2. Extract information
3. Process documents
4. Generate embeddings
5. Store vectors
6. Answer questions using RAG
```