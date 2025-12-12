This project is build to emulate a Message Queue (like RabbitMQ) keeping it simple.
	1, You can 'subscribe' to a queue (or create it if noone is subscribed)
	2. You can 'publish' messages in a queue you are subscribed
	3. You can 'get' a message from a queue you are subscribed
	4. You can 'leave' the queue you subscribed

Once a message is read, it's removed from the queue. The queue is FIFO

You can talk to this MQ using HTTP with the following API

GET /subscribe?queue=<queue-name>&ID=<user-ID>

POST /publish, body { ID: <user-ID>, queue: <queue-name>, message: <message> }
GET /get?queue=<queue-name>&ID=<user-ID>
GET /leave?queue=<queue-name>&ID=<user-ID>

------ @glancell ------
to init: (no needed in docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install fastify

to build:
	npm run build

to launch:
	npm run start