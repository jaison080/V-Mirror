FROM node:18-alpine

WORKDIR /app

COPY ./src/prisma/schema.prisma ./.env ./
RUN npm install -g prisma

CMD npx prisma studio --schema ./schema.prisma
