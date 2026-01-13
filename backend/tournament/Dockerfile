FROM node:20-alpine

# install deps at build time for faster container start
COPY package*.json ./
RUN npm ci --silent

# copy source
COPY src/ src/
COPY tsconfig.json ./

RUN npm run build

#ENV NODE_ENV=development

EXPOSE 3032

# run dev server and force bind to 0.0.0.0 so container is reachable
CMD ["npm", "run", "start"]