FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY services/scraper-worker/package.json services/scraper-worker/package.json
COPY services/crawler-worker/package.json services/crawler-worker/package.json
COPY services/rag-worker/package.json services/rag-worker/package.json
COPY services/query-worker/package.json services/query-worker/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

COPY . .

RUN npx prisma generate


FROM base AS api
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace=@scraper/api"]


FROM base AS crawler-worker
CMD ["npm", "run", "dev", "--workspace=@scraper/crawler-worker"]


FROM base AS rag-worker
CMD ["npm", "run", "dev", "--workspace=@scraper/rag-worker"]


FROM base AS query-worker
CMD ["npm", "run", "dev", "--workspace=@scraper/query-worker"]


FROM mcr.microsoft.com/playwright:v1.61.1-jammy AS scraper-worker-base

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY services/scraper-worker/package.json services/scraper-worker/package.json
COPY services/crawler-worker/package.json services/crawler-worker/package.json
COPY services/rag-worker/package.json services/rag-worker/package.json
COPY services/query-worker/package.json services/query-worker/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

COPY . .

RUN npx prisma generate


FROM scraper-worker-base AS scraper-worker

CMD ["npm", "run", "dev", "--workspace=@scraper/scraper-worker"]