FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production
COPY src ./src
COPY server.js .
COPY scripts ./scripts
COPY sql ./sql
ENV NODE_ENV=production PORT=3000
EXPOSE 3000
CMD ["sh", "-c", "node scripts/migrate.js && node server.js"]
