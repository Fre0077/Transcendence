










------ @glancell ------
to init: (no needed in docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install fastify ws @fastify/websocket

	(if not founding ws)
	npm i --save-dev @types/ws


to build:
	npm run build

to launch:
	npm run start


nice tutorial:
https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/