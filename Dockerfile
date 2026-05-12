# Étape 1 : build TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration
COPY package*.json tsconfig.json ./

# Installation de toutes les dépendances (dev incluses pour le build)
RUN npm install

# Copie du code source et compilation
COPY src ./src
RUN npm run build

# Étape 2 : image finale légère
FROM node:20-alpine AS runtime

WORKDIR /app

# Copie uniquement du nécessaire depuis le builder
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Utilisateur non-root pour la sécurité
USER node

ENTRYPOINT ["node", "dist/index.js"]
