FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY .env ./
COPY src ./src

RUN npm run build

COPY assets ./assets