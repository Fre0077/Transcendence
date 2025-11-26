to init: (no needed for docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install fastify ws @fastify/websocket @fastify/static
	npm install uuid #remove after link with user database

to build:
	npm run build

to launch:
	npm run dev


nice tutorial:
https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/