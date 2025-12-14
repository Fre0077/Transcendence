| - - - - - - - - - |
|  Game Service API |
| - - - - - - - - - |

The /gamesocket websocket processes input and the game mechanics.
Once connected you can JOIN a game and make your MOVEs.
Once every 60ms after a successful JOIN request you will receive the 'GameState' JSON with the position of the ball, of the players, etc ...

<!--- GameState --->
interface BallState {
	pos: number[];
	angle: number;
}

interface PaddleState {
	posY:number;
	offset:number;
	height:number;
	width:number;
}

interface GameState {
	score: number[];
	ball: BallState;
	paddle:PaddleState[];
	playing:boolean;
	timeout: number;
}

Note that the game is expected to be played in a square, so the physics of the ball will be messy if you display a rectangular field. The top-left corner of the filed is (0,0),
the bottom-right one is (1,1).

Here is a brief explaination on how to use all the methods:

<!-- ===== AUTH ===== -->
Request:
{
	method: 'AUTH',	(mandatory)
	ID: <playerID>	(mandatory)
}
Description: This is the first message to inoltrate to the backend, all other requests befor this (or if the Authentication fails) will be ignored.
Reply:
{
	method: 'AUTH_REPLY',
	status: 'success/failure'
}

<!-- ===== JOIN ===== -->

Request:
{
  method: 'JOIN',       (mandatory)
  gameID: <gameID>,     (mandatory)
}
@gameID: the ID of the game as a string

Description: Joins a game with the specified ID, if any of the property is missing
or invalid or there is no game with the gameID requested, it fails.
Reply:
{
  method: 'JOIN_REPLY',
  status: 'success/failure',
  value: <gameID>,
  comment: <comment>		 (only on status === 'failure')
}

<!-- ===== LEAVE ===== -->
{
	method: 'LEAVE'
}
Description: Leaves the game. If not authenticated or not joined a game the
request fails
Reply:
{
	method: 'LEAVE_REPLY',
	status: 'success/failure',
	comment: <comment>
}

<!-- ===== MOVE ===== -->
Request:
{
  method: 'MOVE',
  value: <moveType>
}
@value is the kind of move the player wants to do as a string, the options are:
  "UP_PRESS"    (the player pressed the Up key)
  "DW_PRESS"    (the player pressed the Down key)
  "UP_RELEASE"  (the player releaased the Up key)
  "DW_RELEASE"  (the player releaased the Down key)
  "START_PRESS" (the player requested the round to begin)
  "RESET_PRESS" (the player requested the game to be resetted) (maybe to remove)

Description: this is how the player interacts with the game mechanics and some basic match management.
Reply (only in case of failure):
{
	method: 'MOVE_REPLY',
	status: 'failure',
	comment: <comment>	
}

When the Game is finished or someone RESETted the game, the data regarding that game is (will be) stored in a database. 










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



VARIABLES TO DEFINE in .env

PORT: The port on which the server will be listening on
MYURL: e.g. 'http://my.ip.add.res:PORT'
BUNNYURL: The URL of the ft_bunny container (e.g. 'http://bunny.ip.add.res:BUNNYPORT)
MYPASS: The password used to access the bunnyMQ service




nice tutorial:
https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/