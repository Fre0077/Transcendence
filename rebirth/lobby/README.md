This project's goald is to provide a Lobby Service's backend using Fastify with Websocket connections and the following API:

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

<!-- ===== CREATE ===== -->
Reqest:
{
  method: 'CREATE',     (mandatory)
}
@format: the number of rounds a player need to win to win the match

Description: Creates a lobby, if 'format' is a valid format the lobby inherits that format. The player automatically joins the lobby that he created
Reply:
{
  method: 'CREATE_REPLY',
  status: 'success/failure',
  value: <lobbyID>,           (only on status === 'success')
  comment: <reason>           (only on status === 'failure')
}

<!-- ===== JOIN ===== -->
Request:
{
  method: 'JOIN',       (mandatory)
  lobbyID: <lobbyID>,   (mandatory)
}
@lobbyID: the ID of the lobby as a string
@playerID: the ID of the player as a string

Description: Joins a lobby with the specified ID, if any of the property is missing
or invalid or there is no lobby with the lobbyID requested, it fails.
Reply:
{
  method: 'JOIN_REPLY',
  status: 'success/failure',
  value: <lobbyID>,           (only on status === 'success')
  comment: <comment>          (only on status === 'failure')
}

<!-- ===== LEAVE ===== -->

Request:
{
	method: 'LEAVE'
} 
Description: Leaves the lobby. If not authenticated or not joined a lobby the
request fails. After a successful LEAVE request, the connection with the websocket is closed.
Reply:
{
	method: 'LEAVE_REPLY',
	status: 'success/failure',
	comment: <comment>
}

<!-- ===== SET ===== -->
Request:
{
	method: 'SET',
	...
}
Description: Changes values/settings of the lobby. see later

<!-- ===== BOT ===== -->
Request:
{
	method: 'BOT',
	value: <action>
}

Description: ADDs or REMOVEs bots to the lobby. If you are not in a lobby the request will fail.
Reply:
{
	method: 'BOT_REPLY',
	status: 'success/failure',
	comment: <comment>
}

<!-- ===== START ===== -->
Request:
{
  method: 'START'
}

Description: Starts the lobby. only one player will do that, than the lobby is closed and set to 'in-game'.
If the lobby started correctly the 'value' of the reply is set to the 'gameID' to join
Note: the other player will be notified that the lobby was successfully started by the 'ingame' propery of the "lobbyStatus" that gets sent once every second
Reply:
{
  method: 'START_REPLY',
  status: 'succes/failure',
  comment: <comment>,
  value:<gameID>      (only on status === 'success')
}












------ @glancell ------
to init: (no needed in docker)
	npm init -y
	npm i -D @types/node
	(copy the tsconfig.json)
	(add dependecies in package.json)


to install:
	npm install typescript --save-dev
	npm install fastify ws @fastify/websocket @fastify/static
	npm install uuid


to build:
	npm run build

to launch:
	npm run dev


nice tutorial:
https://betterstack.com/community/guides/scaling-nodejs/fastify-websockets/