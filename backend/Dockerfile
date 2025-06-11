FROM node:lts as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install --production

COPY --from=builder /app/dist ./dist

COPY .env ./.env

EXPOSE 3001

CMD [ "node", "dist/server.js" ]