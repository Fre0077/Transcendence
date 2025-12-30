FROM node:20-bullseye-slim
WORKDIR /app

# copy only chat package files and install deps
COPY chat/package*.json ./
RUN npm ci --silent

# copy service sources
COPY chat ./

RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3002
ENTRYPOINT ["./entrypoint.sh"]