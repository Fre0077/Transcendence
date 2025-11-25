/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./Game.js";

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;

const fastify = Fastify({ 
    logger: false //too much stuff... 
});

// fetching test html
await fastify.register(import('@fastify/static'), {
    root: new URL('../public', import.meta.url).pathname
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

// serving test html
fastify.get('/', async (request, reply) => {
    request; // ignore
    return reply.sendFile('fastify_frontend.html');
});

// check if the object has 'method' and 'value' properies
function hasMethodAndValue(obj: unknown): obj is { method: string, value: string } {
	return (
		obj !== null
		&& typeof obj === "object"
		&& "method" in obj
		&& "value" in obj
	);
}

// WebSocket route handler
fastify.register(async function (fastify) {
    fastify.get('/websocket', { websocket: true }, (connection, request) => {

        // Logging the connection
        const clientIP = request.socket.remoteAddress;
        console.log(`Client connected from ${clientIP}`);

        //----- Initializing an insance of 'Game' for each connection
        const game = new Game()
        game.start();

        // Send welcome message
        connection.send('Connected to Fastify WebSocket server!');
        // connection.send(game.getPaddingSettingsJSON());          // just padding data se vuoi @aleborghi

        // Handle incoming messages
        connection.on('message', message => {
            try {
                // Format and log message
                // const text = message.toString().trim();

                let msg: unknown;

				// JSON parse
				try {
					msg = JSON.parse(message.toString());
				} catch (err) {
					console.log("Invalid JSON");
					return;
				}

                console.log(`Received from ${clientIP}:`, msg);

                if (!hasMethodAndValue(msg)) {
                    console.log(`invalid JSON obj ${msg}`);
                    return ;
                }

                if (msg.method === 'MOVE') {
                    // start the match
                    if (msg.value === "START_PRESS") game.launch();
                    if (msg.value === "RESET_PRESS") game.reset();

                    // Local player1
                    if (msg.value === "P1UP_PRESS") game.press(1, "Up");
                    if (msg.value === "P1DW_PRESS") game.press(1, "Down");
                    if (msg.value === "P1UP_RELEASE") game.release(1, "Up");
                    if (msg.value === "P1DW_RELEASE") game.release(1, "Down");

                    // Local player2
                    if (msg.value === "P2UP_PRESS") game.press(2, "Up");
                    if (msg.value === "P2DW_PRESS") game.press(2, "Down");
                    if (msg.value === "P2UP_RELEASE") game.release(2, "Up");
                    if (msg.value === "P2DW_RELEASE") game.release(2, "Down");
                }

            } catch (error) {
                console.error('Error processing message:', error);
            }
        });

        // Handle WebSocket errors
        connection.on('error', (error) => {
            console.error(`WebSocket error for ${clientIP}:`, error);
        });

        // Handle connection close
        connection.on('close', (code, reason) => {
            game.stop();
            console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
        });

        // send gamestate to frontend 'FPS' times per second
        setInterval(() => {
            if (connection.readyState === connection.OPEN) {
                connection.send(game.getGameStateJSON());
            }
        }, 1000 / FPS);	// FPS (delay in ms)

        // let winner = game.end();
        // if (winner !== 0) {
        //     if (winner === 1) connection.send('Player 1 Won!!! Congrats');
        //     else if (winner === 2) connection.send('Player 2 Won!!! Yippye');
        // }

    });
});

/* ---- start server ---- */

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};


// entrypoint
start();
