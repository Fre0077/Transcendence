## 🚀 Guida Finale al Setup e Testing

### 1. Architettura e Sicurezza (Punti Chiave)

* **Google Login lato Backend (Spiegazione):**
Quando si dice che il login "deve essere gestito dal backend", si intende che il frontend non deve limitarsi a confermare l'identità dell'utente. Il processo corretto è:
1. Il **Frontend** ottiene un token da Google.
2. Il **Backend** riceve quel token e lo valida contattando direttamente i server di Google.
3. Il **Backend** estrae l'email verificata e genera il JWT interno del tuo sistema.
*Questo evita che un utente malintenzionato possa inviare al server un'email falsa fingendo di aver fatto il login con Google.*


* **JWT & Identità:**
* **Payload:** Si utilizza la **mail** anziché lo username perché è un dato immutabile.
* **Access Token:** Validità 5 minuti.
* **Refresh Token:** Validità 24 ore.


* **Variabili d'ambiente:** Gestione tramite file `.env` e libreria `dotenv`.

---

### 2. Verifica Configurazione RabbitMQ

Prima di avviare il sistema, è fondamentale verificare la connessione tra i microservizi.

* **Azione:** Controlla tutti i file `rabbit.ts` (o i file di configurazione RabbitMQ nel backend).
* **URL Corretto:** Assicurati che l'URL utilizzato sia esattamente:
`amqp://guest:guest@rabbitmq:5672`

---

### 3. Comandi di Gestione (Makefile)

Usa il **Makefile** per gestire l'intero ciclo di vita dell'applicazione:

* **Avvio completo:** `make up` (esegue `docker compose up --build -d`). 

* **Spegnimento:** `make down` (esegue `docker compose down`). 


* **Reset totale:** `make re` (riesegue il build da zero). 

* **Pulizia profonda:** `make clean` (rimuove volumi, immagini e container). 

> **Nota Tecnica:** Se ricevi un errore sulla porta 3001, liberala con:
> `sudo lsof -ti:3001 | xargs kill -9`

---

### 4. Protocollo di Test (Istruzioni per l'Ingegnere)

1. **Sequenza di Avvio automatizzata:** Il file `docker-compose.yml` gestisce già le dipendenze: **RabbitMQ** (con healthcheck) → **Frontend** → **Microservizi** (`auth`, `chat`, `profile`). 

2. **Verifica Stato:** Esegui `docker-compose ps` per confermare che tutti i container siano "Up" o "Healthy". 

3. **Interfacce e Debug:**
* **Piattaforma di Test:** [http://localhost:3000?test=true](https://www.google.com/search?q=http://localhost:3000%3Ftest%3Dtrue)
* **Gestione Code:** [http://localhost:15672](https://www.google.com/search?q=http://localhost:15672) (User: `guest`, Pass: `guest`). 

4. **Analisi Log:**
* Controlla il file `log.log`.
* Verifica che non ci siano errori **4xx** o **5xx**, eccetto quelli previsti dai test sui token scaduti.

---

### ⚠️ AZIONE CRITICA PRIMA DELLA CONSEGNA

**RIMOZIONE BACKDOOR:** Verifica il file `./backend/src/function`.
**ELIMINA** la riga `input.password = 'a'` nella funzione di login. Questa modifica è necessaria per ripristinare la sicurezza del sistema e permettere la validazione reale delle password.

---
=======
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
	status: "connected" | "away | "disconnected"
}

> player statuses:
  - "connected": the player is connected to the lobby's websocket
  - "disconnected": the player disconnected from the lobby's websocket while the game wasn't started
  - "away": the player is playing the game that the lobby is hosting and it isn't necessairly connected to the lobby's websocket

<!-- Lobbystate -->
LobbyState object that will be sent every time the lobby changes

interface LobbyState {
	ID:string;
	gameID:string;
	players:Player[];
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

interface PlayerState {
	ID:string;
	paddle:PaddleState;
}

interface GameState {
	score: number[];
	ball: BallState;
	players:PlayerState[];
	playing:boolean;
	timeout: number;
	winner: number;
}

Note that the game is expected to be played in a square, so the physics of the ball will be messy if you display a rectangular field. The top-left corner of the filed is (0,0),
the bottom-right one is (1,1).

Here is a brief explaination on how to use all the methods:

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

//----
@aleborghi: il back-to-lobby ora funziona dalla parte del backend. quando finisci il game devi tornare alla lobby con un JOIN, pero` aspetta un attimo prima di farlo che i due backend si devono parlare
