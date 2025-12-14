This project is build to emulate a Message Queue (like RabbitMQ) keeping it simple.
	0. You can 'register' to the service to get your ID to accces all the service features
	1, You can 'subscribe' to a queue (or create it if noone is subscribed)
	2. You can 'publish' messages in a queue you are subscribed
	3. You can 'get' a message from a queue you are subscribed
	4. You can 'leave' the queue you subscribed

Once a message is read, it's removed from your version of said queue. The queue is FIFO

You can talk to this MQ using HTTP with the following API

GET /register?endp=<endpoint>&pwd=<password>
GET /subscribe?queue=<queue-name>&ID=<user-ID>
POST /publish, body { ID: <user-ID>, queue: <queue-name>, message: <message> }
GET /get?queue=<queue-name>&ID=<user-ID>
GET /leave?queue=<queue-name>&ID=<user-ID>


How it Works?

It's an HTTP API to queue messages in various threads, like reddit.
When you 'register' you can specify an URL where you want to receeive notifications if new messages are in the queue. Also a password is requested (if endp is specified) so that future registration of said endpoint will block unwanted users.
Note that all these queues are volatiles, meaning that if the bunnyMQ process shuts down all messages are lost, as well as all of the users data. Also when you register a second time to bunnyMQ because you lost the ID, all your subscriptions will be erased.


------ @glancell ------
to init: (no needed in docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install fastify
	npm install uuid

	(if any package is installed but not found: `npm i --save-dev @types/<package-name>`)

to build:
	npm run build

to launch:
	npm run start

--- VARIABLES TO DEFINE in .env ---

PORT: The port on which the server will be listening on
