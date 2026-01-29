FROM node:20-bullseye-slim

WORKDIR /app


COPY chat/package*.json ./

RUN npm install && \
    npm install --save-dev @types/amqplib @types/node typescript ts-node

COPY chat ./

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

# EXPOSE 3002

ENTRYPOINT ["./entrypoint.sh"]