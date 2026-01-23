import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyMetrics from "fastify-metrics";
import path from "path";

import { startRabbit } from "./rabbit";
import { chatEndpoint } from "./src/endpoint";
import { startChatConsumer } from "./src/consumer";

export const fastify = Fastify({
    logger: false
});

// Metrics - Register BEFORE routes
fastify.register(fastifyMetrics, {
    endpoint: '/metrics'
});

// CORS
fastify.register(cors, {

    // (ChatGPT)
    origin: (origin, cb) => {
        // allow requests with no origin (Postman, curl, mobile apps)
        if (!origin) {
            cb(null, true);
            return ;
        }

        // allow ANY origin
        cb(null, origin);
    },
    credentials: true,  // 🔥 REQUIRED
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
});

// Parser text/plain
fastify.addContentTypeParser(
    "text/plain",
    { parseAs: "string" },
    function (req, body, done) {
        done(null, body);
    }
);

// Upload avatar
fastify.register(fastifyMultipart);

// Static files (serve avatar salvati)
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/",
});

fastify.register(websocket);

// ENDPOINT SOLO CHAT
fastify.register(chatEndpoint, { prefix: "/api" });

// RICEZIONE DATI RABBITMQ (TEST)
startRabbit();
startChatConsumer();

// Start server
fastify.listen({ port: 3002, host: process.env.HOST }, (err, address) => {
    if (err) throw err;
    console.log(`chat server online → ${address}`);
});