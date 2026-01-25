FROM node:20-bullseye-slim

WORKDIR /app


COPY profile/package*.json ./

RUN npm install && \
    npm install --save-dev @types/amqplib @types/node typescript ts-node

COPY profile ./

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV TS_NODE_TRANSPILE_ONLY=true

EXPOSE 3003
# EXPOSE 5555 <-- debug db per i game

ENTRYPOINT ["./entrypoint.sh"]