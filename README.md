
## Technical Architecture Report

**Project Type:** Distributed Web Scraping and RAG Framework  
**Architecture:** Microservices + Event-Driven Processing  
**Language:** TypeScript  
**Deployment:** Dockerized Services  
**Main Concepts:** Distributed Systems, Asynchronous Processing, Web Crawling, Data Extraction, Vector Search, LLM Integration

## Demo Video

[Watch the project demo] https://drive.google.com/file/d/1r_vbytSF1Se8eU4hneWTv9jwYVpy3ZpN/view?usp=sharing

---

# Table of Contents

1. Project Overview

2. System Architecture Overview

3. Microservices Architecture Decision
   - Web Application
   - API Service
   - Crawler Worker
   - Scraper Worker
   - RAG Worker
   - Query Worker
   - Shared Package
   - Architecture Rationale and Alternative Considered

4. Event-Driven Queue-Based Architecture
   - Multiple Queue Pipeline
   - Crawl Queue
   - Scraper Queue
   - RAG Queue
   - Query Queue
   - Queue Separation Benefits

5. Complete System Workflow
   - Data Ingestion Flow
   - Query Retrieval Flow
   - URL Processing Sequence Diagram
   - RAG Query Sequence Diagram

6. Scraper Intelligence
   - Static Website Processing
   - Dynamic Website Processing
   - Static vs Dynamic Detection Workflow
   - Playwright Technology Choice

7. Technology Decisions and Alternatives
   - TypeScript
   - Fastify
   - BullMQ and Redis
   - PostgreSQL
   - Prisma
   - Docker

8. RAG Architecture
   - Document Processing Pipeline
   - Chunking and Embedding Generation
   - Vector Search and Retrieval Flow

9. Fault Tolerance and Reliability
   - Queue Retry Mechanisms
   - Failure Recovery

10. Ethics and Compliance
   - robots.txt Handling
   - Respectful Crawling Practices
   - Terms of Service Considerations

11. Future Improvements
   - Distributed Embedding Workers
   - Improved Scheduling
   - Authentication and Multi-Tenant Support

12. Conclusion

---

# 1. Project Overview

The goal of this project was to design and implement a **distributed web crawling and Retrieval-Augmented Generation (RAG) framework** capable of collecting information from websites, processing the extracted content, and preparing it for semantic search and AI-powered question answering.

Instead of building a traditional scraper that performs all operations sequentially, the system was designed using a **distributed event-driven architecture** where each component has a dedicated responsibility.

The framework follows this pipeline:

```
Website URL

        ↓

Crawling

        ↓

Scraping

        ↓

Data Processing

        ↓

Storage

        ↓

Embedding Generation

        ↓

Vector Database

        ↓

RAG Question Answering
```

The architecture was designed with the following principles:

- Separation of responsibilities
- Independent scalability
- Fault tolerance
- Asynchronous processing
- Maintainability
- Future extensibility

---

# 2. System Architecture Overview

The system consists of several independent services.


```

                         User

                          |

                          v

                    Web Application

                          |

                          v

                     API Service


          +---------------+---------------+
          |                               |
          v                               v


    Crawl Queue                      Query Queue

          |                               |

          v                               v


  Crawler Worker                 Query Worker

          |

          v

   Scraper Queue

          |

          v

  Scraper Worker

          |

          v

     RAG Queue

          |

          v

    RAG Worker

          |

     +----+----+

     |         |

     v         v

PostgreSQL   Qdrant

                |

                v

               LLM
```

# 3. Microservices Architecture Decision

## Decision

The application was divided into multiple independent services following a **microservices and event-driven architecture**.

The final project structure is:

```
Distributed RAG Framework

apps/

├── api
│
└── web


services/

├── crawler-worker

├── scraper-worker

├── rag-worker

└── query-worker


packages/

└── shared
```

---

# Service Responsibilities

## 1. Web Application (`apps/web`)

The web application provides the user interface for interacting with the system.

Responsibilities:

- Submit URLs for crawling
- Send questions to the RAG system
- Display generated answers
- Display retrieved sources and references

The frontend communicates only with the API service and does not directly access internal workers.

---

# 2. API Service (`apps/api`)

The API acts as the entry point of the system.

Responsibilities:

- Receive user requests
- Validate input
- Create crawl jobs
- Manage application workflows
- Provide query endpoints
- Communicate with queues

The API does **not perform heavy processing**.

Instead of:

```
User Request

      ↓

API downloads website

      ↓

API processes documents
```

The system follows:

```
User Request

      ↓

API

      ↓

Queue Job Created

      ↓

Background Workers Process Task
```

This keeps the API responsive and scalable.

---

# 3. Crawler Worker (`services/crawler-worker`)

The crawler worker is responsible for discovering websites and preparing scraping tasks.

Responsibilities:

- Crawl website links
- Discover new URLs
- Validate URLs
- Check crawling permissions
- Respect robots.txt rules
- Prevent duplicate URLs
- Create scraper jobs

Workflow:

```
URL

 ↓

Crawler Worker

 ↓

Discovered Pages

 ↓

Scraper Queue

 ↓

Scraper Worker
```

The crawler does not extract content. Its responsibility is only discovering **what should be processed**.

---

# 4. Scraper Worker (`services/scraper-worker`)

The scraper worker handles extracting information from discovered pages.

Responsibilities:

- Download web pages
- Detect static or dynamic websites
- Use appropriate extraction strategy
- Parse HTML content
- Extract meaningful text
- Store raw extracted content

Processing:

```
Page URL

      |

      v

Scraper Worker


      |

      +----------------+
      |                |
      v                v

 Static Site      Dynamic Site

 Axios            Playwright

 Cheerio          Browser Rendering


      |

      v

Extracted Content

      |

      v

Database
```

Separating scraping from crawling allows scraping workloads to scale independently.

---

# 5. RAG Worker (`services/rag-worker`)

The RAG worker is responsible for transforming scraped data into a searchable AI knowledge base.

It performs all preparation steps required before retrieval.

Responsibilities:

- Read scraped documents
- Clean extracted content
- Split documents into chunks
- Generate embeddings
- Store structured information in PostgreSQL
- Store vector embeddings in Qdrant

Workflow:

```
Scraped Documents

        |

        v

Cleaning

        |

        v

Chunking

        |

        v

Embedding Generation

        |

        +----------------+
        |                |
        v                v

 PostgreSQL          Qdrant

 Metadata            Vector Data
```

This separation prevents the scraper from becoming overloaded with AI processing responsibilities.

---

# 6. Query Worker (`services/query-worker`)

The query worker handles the RAG retrieval pipeline.

Its responsibility begins when a user asks a question.

Responsibilities:

- Receive user questions
- Generate query embeddings
- Search Qdrant
- Retrieve relevant chunks
- Build context
- Send context to the LLM
- Generate final answers

Workflow:

```
User Question

        |

        v

Query Worker

        |

        v

Generate Query Embedding

        |

        v

Qdrant Similarity Search

        |

        v

Retrieve Relevant Chunks

        |

        v

LLM Generation

        |

        v

Final Answer
```

Separating query processing from ingestion allows the system to handle:

- many users querying simultaneously
- large crawling operations
- independent scaling of AI workloads

---

# 7. Shared Package (`packages/shared`)

The shared package contains reusable code used by multiple services.

Examples:

```
packages/shared

├── Queue Names

├── Redis Configuration

├── Validation Schemas

├── Shared Types

└── Common Utilities
```

Benefits:

- Avoid duplicated logic
- Maintain consistency
- Easier refactoring
- Single source of truth

---

# Architecture Overview

The complete architecture becomes:

```
                         User

                          |

                          v

                    Web Application

                          |

                          v

                     API Service


                          |

        +-----------------+-----------------+

        |                                   |

        v                                   v


  Crawl Queue                          Query Queue

        |                                   |

        v                                   v


Crawler Worker                     Query Worker

        |

        v

Scraper Queue

        |

        v

Scraper Worker

        |

        v

RAG Worker

        |

        +-------------------+

        |                   |

        v                   v

 PostgreSQL             Qdrant

(Database)          (Vector Database)


                          |

                          v

                         LLM
```

---

# Why This Architecture Was Chosen

The system separates the application into **three major phases**:

## Phase 1: Data Acquisition

Responsible for collecting information.

Components:

- API
- Crawler Worker
- Scraper Worker

---

## Phase 2: Knowledge Preparation

Responsible for converting raw data into AI-ready knowledge.

Component:

- RAG Worker

---

## Phase 3: Knowledge Retrieval

Responsible for answering user questions.

Components:

- Query Worker
- Qdrant
- LLM

This separation follows the single responsibility principle and allows each phase to scale independently.

---

# Alternative Considered

## Single Backend Application

An alternative design was a single service containing:

```
API

Crawler

Scraper

Chunking

Embeddings

RAG Retrieval
```

### Why it was rejected

Although simpler initially, it introduces several problems:

- difficult horizontal scaling
- increased deployment complexity
- one failure affects the whole system
- AI workloads compete with crawling workloads
- harder maintenance as the project grows

The distributed architecture better matches the requirements of a scalable RAG framework.

# 4. Event-Driven Queue-Based Architecture

## Decision

The system uses multiple independent queues to connect distributed services.

The final processing pipeline consists of four queues:

```
                    API
                     |
                     |
                     v

              Crawl Queue
                  |
                  |
                  v

          Crawler Worker
                  |
                  |
                  v

             Scraper Queue
                  |
                  |
                  v

          Scraper Worker
                  |
                  |
                  v

               RAG Queue
                  |
                  |
                  v

            RAG Worker
                  |
                  |
                  v

          Query Queue
                  |
                  |
                  v

          Query Worker
```

Each queue represents a separate processing stage with its own workload, retry policy, and scaling requirements.

---

# Why Multiple Queues?

The system handles several fundamentally different types of operations:

|Stage|Responsibility|Workload Type|
|---|---|---|
|Crawling|Discovering URLs|Network traversal|
|Scraping|Extracting website content|I/O intensive|
|RAG Processing|Cleaning, chunking, embedding|CPU/API intensive|
|Query Processing|Retrieval and generation|User-facing latency sensitive|

Combining these operations into one queue would create unnecessary coupling between unrelated workloads.

## Why Separate RAG Processing?

Embedding generation can be expensive.

Without a separate queue:

```
Scraper Worker

        |

        v

Download page

        |

        v

Generate embedding

        |

        v

Store vector
```

The scraper becomes slow and cannot efficiently crawl.

With separation:

```
Scraper Worker

        |

        v

Store extracted data

        |

        v

RAG Queue

        |

        v

RAG Worker handles AI processing
```

The two workloads scale independently.


# 5. Complete System Workflow

The system workflow is divided into two main flows:

1. **Data Ingestion Flow**
    
    - Responsible for crawling websites, extracting content, processing documents, and storing searchable knowledge.
2. **Query Retrieval Flow**
    
    - Responsible for retrieving relevant information and generating answers using the RAG pipeline.

# Sequence Diagram: URL Processing Flow

```
User
 |
 | Submit URL
 v
Web Application
 |
 v
API Service
 |
 | Create Crawl Job
 v
Crawl Queue
 |
 v
Crawler Worker
 |
 | Create Scrape Jobs
 v
Scraper Queue
 |
 v
Scraper Worker
 |
 | Send Documents
 v
RAG Queue
 |
 v
RAG Worker
 |
 | Store Metadata
 | Store Embeddings
 +------------+
 |            |
 v            v
PostgreSQL   Qdrant
```

---

# Sequence Diagram: RAG Query Flow

```
User
 |
 | Ask Question
 v
Web Application
 |
 v
API Service
 |
 | Create Query Job
 v
Query Queue
 |
 v
Query Worker
 |
 | Generate Query Embedding
 v
Qdrant
 |
 | Return Similar Chunks
 v
Query Worker
 |
 | Send Context
 v
LLM
 |
 v
Generated Answer
 |
 v
User
```

# 6. Scraper Intelligence

## Static vs Dynamic Website Detection

The decision was placed inside the Scraper Worker.

Reason:

The scraper decides **how content should be extracted**.

---

Workflow:

```
             Page URL

                |

                v

          Scraper Worker


                |

        Detect rendering need


        /                 \


 Static                 Dynamic


  |                       |

Axios                 Playwright


  |                       |

Cheerio             Browser DOM


        \              /

             Extract Text

                  |

                  v

             PostgreSQL
```

---

# Static Websites

Technology:

- Axios
- Cheerio

Advantages:

- Fast
- Low resource usage
- Simple

---

# Dynamic Websites

Technology:

- Playwright

Advantages:

- Executes JavaScript
- Supports modern frameworks
- Gets final rendered DOM

---

# Alternative

Puppeteer / Selenium

Rejected because:

### Puppeteer

- Mostly Chrome-focused

### Selenium

- heavier architecture
- slower setup

Playwright provides:

- Chromium
- Firefox
- WebKit

support with one API.

---

# 7. Technology Decisions

## TypeScript

### Why

Chosen because:

- static typing
- safer refactoring
- excellent backend ecosystem
- strong IDE support

Alternative:

JavaScript

Rejected because runtime errors are easier to introduce.

---

## Fastify

### Why

Chosen because:

- high performance
- TypeScript support
- schema validation

Alternative:

Express

Rejected because more manual configuration is required.

---

## BullMQ + Redis

### Why

Chosen because:

- distributed jobs
- retries
- delayed jobs
- concurrency control

Alternative:

Kafka

Rejected because:

Kafka is optimized for event streaming rather than background task processing.

---

## PostgreSQL

Chosen because:

The data has clear relationships:

```
CrawlRun

 |

Pages

 |

Chunks

 |

Embeddings
```

Alternative:

MongoDB

Rejected because relational modeling fits the data better.

---

## Prisma

Chosen because:

- generated types
- migrations
- safer database queries

Alternative:

Sequelize

Rejected because Prisma provides stronger TypeScript integration.

---

## Docker

Chosen because:

Every service runs in an isolated reproducible environment.

Example:

```
API container

Crawler container

Scraper container

Database container

Redis container
```

Alternative:

Manual installation

Rejected because environment differences create deployment issues.

---

# 8. RAG Architecture

After scraping, the system evolves into:

```
Documents

 |

Cleaning

 |

Chunking

 |

Embedding Model

 |

Vector Database

(Qdrant)


 |

Similarity Search


 |

Relevant Context


 |

LLM


 |

Answer
```

---

# Query Flow

```
User Question

       |

       v

Generate Query Embedding

       |

       v

Search Qdrant

       |

       v

Retrieve Relevant Chunks

       |

       v

Build Prompt

       |

       v

LLM Generation

       |

       v

Final Answer
```

---

# 9. Fault Tolerance

The system uses BullMQ retry mechanisms.

Example:

```
Scrape Job

Attempt 1

   |

Failure

   |

Retry


Attempt 2


   |

Failure


Attempt 3


   |

Success
```

Useful for:

- temporary network failures
- website downtime
- timeouts

---

# 10. Ethics and Compliance

The framework follows responsible scraping practices.

## robots.txt

Before crawling:

The crawler checks:

```
robots.txt
```

to determine whether the website allows access to specific paths.

---

## Respectful Crawling

The system avoids:

- excessive requests
- unnecessary duplication
- aggressive crawling behavior

---

## Terms of Service

Only publicly available information is processed.

The system should be configured to respect:

- website rules
- access restrictions
- copyright limitations

---

# 11. Future Improvements

Possible extensions:

## Distributed Embedding Workers

```
Scraper

 |

Embedding Queue

 |

Embedding Workers
```

---

## Better Scheduling

Add:

- crawl priority
- domain rate limits
- adaptive delays

---

## Authentication and Multi-Tenant Support

Allow multiple users:

```
User A

User B

User C

      |

  Same platform
```

---

# Conclusion

This project demonstrates a complete distributed architecture combining:

- microservices
- asynchronous processing
- queue-based communication
- scalable workers
- web crawling
- intelligent scraping
- database persistence
- vector search
- RAG-based AI answering

The major architectural decisions were made with scalability, maintainability, and real-world deployment considerations in mind.

The result is not only a scraper, but a foundation for a production-level AI knowledge retrieval platform.

---