FROM node:22-alpine AS base
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json apps/api/package.json
COPY services/scraper-worker/package.json services/scraper-worker/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install
COPY . .
RUN npx prisma generate

FROM base AS api
EXPOSE 3000
CMD ["npm", "run", "dev", "--workspace=@scraper/api"]

FROM base AS scraper-worker
CMD ["npm", "run", "dev", "--workspace=@scraper/scraper-worker"]

FROM base AS crawler-worker
CMD ["npm", "run", "dev", "--workspace=@scraper/crawler-worker"]

