FROM node:20-bullseye-slim
WORKDIR /app

# copy only auth package files and install deps
COPY auth/package*.json ./
RUN npm ci --silent

# copy service sources
COPY auth ./

# ensure entrypoint is executable
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3001
ENTRYPOINT ["./entrypoint.sh"]