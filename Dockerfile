FROM --platform=linux/amd64 node:20.13.1-alpine3.20 AS build

WORKDIR /app

COPY /src/package*.json ./
RUN npm ci --omit=dev

COPY src ./

FROM --platform=linux/amd64 node:20.13.1-alpine3.20 AS production

WORKDIR /app

COPY --from=build /app /app

EXPOSE 80

CMD [ "node", "server.js" ]