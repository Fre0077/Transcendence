Transcendence
---------------------------------------------------------------------------------------

Use make to build and enter here to test frontend:
  http://localhost:3000/home
use make clean

sidecar


HOW-DOES-MY-API-WORKS? by topiana-

| - - - - - - - - - |
| Lobby Service API |
| - - - - - - - - - |

The /lobbysocket websocket handles the lobby creation and facilitates the Game service.
Once you connect you can CREATE or JOIN a lobby.
Every second after a successful CREATE/JOIN you will receive a 'LobbyState' JSON specifying the players in the lobby, the status of the lobby and other useful informations.

type Player = {
	ID:string,
	status: "connected" | "disconnected" | "ingame" | "joining"
}

LobbySateJSON:
{
  ID:string,        // ID of the lobby
  gameID:string,    // ID of the game the lobby is playing
  ingame:boolean,   // are the player playing?
  format:number,    // the format of the game (number of sets to win a match)
  players:Player[]  // an array of player UUIDs and statuses
}

Note that if the 'ingame' propery is set to true the players are expected to join the game specified in gameID, since someone successfully STARTed the lobby.


Here is a brief explaination on how to use all the methods:

<!-- ===== CREATE ===== -->
Reqest:
{
  method: 'CREATE',     (mandatory)
  playerID: <playerID>, (mandatory)
  format: <format>      (optional)
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
  playerID: <playerID>  (mandatory)
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
request fails
Reply:
{
	method: 'LEAVE_REPLY',
	status: 'success/failure',
	comment: <comment>
}

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







| - - - - - - - - - |
|  Game Service API |
| - - - - - - - - - |

The /gamesocket websocket processes input and the game mechanics.
Once connected you can JOIN a game and make your MOVEs.
Once every 60ms after a successful JOIN request you will receive the 'GameState' JSON with the position of the ball, of the players, etc ...

GameStateJSON:
{
  score:number[],		  /* score of the match [player1, player2] */
  ball: {
				pos: this.ball.pos,		/* array of 2 coordinates [X, Y] of the CENTER of the ball */
				dir: this.ball.angle,	/* angle of the ball, used for BOT play */
  },
  player1:number,     /* single Y coordinate of the CENTER of the paddle*/
  player2:number2,    /* single Y coordinate of the CENTER of the paddle*/
  paddle: [				    /* paddle size for both players: [player1, player2] */
    {
      height:number,
      width:number,
      offset:number   /* single X coordinate of the CENTER of the paddle */
    },
    {
      height:number,
      width:number,
      offset:number   /* single X coordinate of the CENTER of the paddle (could need a readjustment for player2) */
    }
  ],
  timeout:number      /* The number of millisecond the game will be halting (inbetween rounds or at game start) */
}

Note that the game is expected to be played in a square, so the physics of the ball will be messy if you display a rectangular field. The top-left corner of the filed is (0,0),
the bottom-right one is (1,1).

Here is a brief explaination on how to use all the methods:

<!-- ===== JOIN ===== -->

Request:
{
  method: 'JOIN',       (mandatory)
  gameID: <gameID>,     (mandatory)
  playerID: <playerID>  (mandatory)
}
@gameID: the ID of the game as a string
@playerID: the ID of the player as a string

Description: Joins a game with the specified ID, if any of the property is missing
or invalid or there is no game with the gameID requested, it fails.
Reply:
{
  method: 'JOIN_REPLY',
  status: 'success/failure',
  value: <gameID>,
  comment: <comment>
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
Reply: NO-REPLY

When the Game is finished or someone RESETted the game, the data regarding that game is (will be) stored in a database. 

//----
@aleborghi: il back-to-lobby ora funziona dalla parte del backend. quando finisci il game devi tornare alla lobby con un JOIN, pero` aspetta un attimo prima di farlo che i due backend si devono parlare