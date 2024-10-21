FROM node:18.12.1 AS builder
ENV NODE_ENV build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:18.12.1-alpine3.15
ENV NODE_ENV production
WORKDIR /app

RUN mkdir /app/environments/
COPY --from=builder /app/environments/production.env /app/environments/
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/src/keys/ /app/src/keys/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/build/ /app/build/
EXPOSE 3005
CMD ["npm", "run", "serve"]