
/* ---- Tutorial example ---- */
// import Fastify from 'fastify';

// const fastify = Fastify({ 
//     logger: true 
// });

// await fastify.register(import('@fastify/static'), {
//     root: new URL('../public', import.meta.url).pathname
// });

// // Register WebSocket plugin
// await fastify.register(import('@fastify/websocket'));

// fastify.get('/', async (request, reply) => {
//     request; // ignore
//     return reply.sendFile('index.html');
// });

// // WebSocket route handler
// fastify.register(async function (fastify) {
//     fastify.get('/websocket', { websocket: true }, (connection, request) => {

//         request;    //ignore

//         // Logging the connection
//         const clientIP = request.socket.remoteAddress;
//         console.log(`Client connected from ${clientIP}`);

//         // Send welcome message
//         connection.send('Connected to Fastify WebSocket server!');

//         // Handle incoming messages
//         connection.on('message', message => {
//             try {
//                 const text = message.toString();
//                 console.log(`Received from ${clientIP}:`, text);

//                 // Check if connection is still open before sending
//                 if (connection.readyState === connection.OPEN) {
//                     connection.send(`Echo: ${text}`);
//                 }
//             } catch (error) {
//                 console.error('Error processing message:', error);
//             }
//         });

//         // Handle WebSocket errors
//         connection.on('error', (error) => {
//             console.error(`WebSocket error for ${clientIP}:`, error);
//         });

//         // Handle connection close
//         connection.on('close', (code, reason) => {
//             console.log(`Client ${clientIP} disconnected - Code: ${code}, Reason: ${reason?.toString() || 'none'}`);
//         });
//     });
// });

// const PORT = Number(process.env.PORT) || 3000;

// const start = async () => {
//     try {
//         await fastify.listen({ port: PORT, host: '0.0.0.0' });
//         console.log(`Server running on http://localhost:${PORT}`);
//     } catch (err) {
//         fastify.log.error(err);
//         process.exit(1);
//     }
// };

// start();

/* ------------------------- */
/* ------------------------- */
/* ------------------------- */


import Fastify from 'fastify';
import { Game } from "./game.js";

const FPS:number = 60;
const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({ 
    logger: false //too much stuff... 
});

await fastify.register(import('@fastify/static'), {
    root: new URL('../public', import.meta.url).pathname
});

// Register WebSocket plugin
await fastify.register(import('@fastify/websocket'));

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

        //-----
        const game = new Game()
        game.start();

        // Send welcome message
        connection.send('Connected to Fastify WebSocket server!');

        // Handle incoming messages
        connection.on('message', message => {
            try {
                const text = message.toString();
                console.log(`Received from ${clientIP}:`, text);

                // start game
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

        // send gamestate to frontend
        setInterval(() => {
            if (connection.readyState === connection.OPEN) {
                connection.send(game.getGameStateJSON());
            }
        }, 1000 / FPS);	// FPS (delay in ms)

        connection.on('open', () => {
            console.log('new cconnectuin open');
             
        });
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

start();
