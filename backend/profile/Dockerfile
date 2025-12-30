FROM node:20-bullseye-slim
WORKDIR /app

# copy only profile package files and install deps
COPY profile/package*.json ./
RUN npm ci --silent && npm i --save-dev @types/amqplib --silent

# copy service sources
COPY profile ./

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3003
ENTRYPOINT ["./entrypoint.sh"]