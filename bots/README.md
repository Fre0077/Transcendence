





------ @glancell ------
to init: (no needed in docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install ws fastify
	npm install uuid

	(if any package is installed but not found: `npm i --save-dev @types/<package-name>`)

to build:
	npm run build

to launch:
	npm run start

--- VARIABLES TO DEFINE in .env ---

PORT: The port on which the server will be listening on
MYURL: e.g. 'http://my.ip.add.res:PORT'
BUNNYURL: The URL of the ft_bunny container (e.g. 'http://bunny.ip.add.res:BUNNYPORT)
MYPASS: The password used to access the bunnyMQ service

One url for each game sercvice
 - PONGURL: The URL of the Pong container (e.g. 'http://pong.ip.add.res:PONGPORT)
