FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/

RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]
