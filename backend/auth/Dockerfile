FROM node:20-bullseye-slim

WORKDIR /app


COPY auth/package*.json ./

RUN npm install && \
    npm install --save-dev @types/amqplib @types/node typescript ts-node

COPY auth ./

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]