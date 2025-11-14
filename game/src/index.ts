/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./game.js";

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3002;

const fastify = Fastify({ 
    logger: true //too much stuff... 
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
                const text = message.toString().trim();
                console.log(`Received from ${clientIP}:`, text);

                // start the match
                if (text === "SPACE_PRESS") game.launch();

                // Local player1
                if (text === "W_PRESS") game.press(1, "Up");
                if (text === "S_PRESS") game.press(1, "Down");
                if (text === "W_RELEASE") game.release(1, "Up");
                if (text === "S_RELEASE") game.release(1, "Down");

                // Local player2
                if (text === "I_PRESS") game.press(2, "Up");
                if (text === "K_PRESS") game.press(2, "Down");
                if (text === "I_RELEASE") game.release(2, "Up");
                if (text === "K_RELEASE") game.release(2, "Down");

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
