FROM node:20-alpine
WORKDIR /app

# install deps at build time for faster container start
COPY package*.json ./
RUN npm ci --silent

# copy source
COPY . .

ENV NODE_ENV=development
EXPOSE 3000

# run dev server and force bind to 0.0.0.0 so container is reachable
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]