# Étape 1 : build TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY src ./src
RUN npm run build

# Étape 2 : image finale légère
FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "dist/server.js"]