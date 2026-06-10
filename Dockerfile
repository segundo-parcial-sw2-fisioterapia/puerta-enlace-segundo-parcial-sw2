# Etapa de construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configuración de red para evitar timeouts en conexiones lentas
RUN pnpm config set fetch-retries 5 && pnpm config set fetch-timeout 600000

# Instalar dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copiar el código fuente y compilar
COPY . .
RUN pnpm run build

# Etapa de producción
FROM node:22-alpine

WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Configuración de red para evitar timeouts
RUN pnpm config set fetch-retries 5 && pnpm config set fetch-timeout 600000

# Instalar solo dependencias de producción
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copiamos la compilación generada
COPY --from=builder /app/dist ./dist

# Copiamos el archivo .env para que esté dentro del contenedor
COPY .env .env

# Exponemos el puerto 4000 según el .env
EXPOSE 4000

# Comando de inicio
CMD ["node", "dist/main"]
