import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

import { startRabbit } from "./rabbit";
import { chatEndpoint } from "./src/endpoint";
import { startChatConsumer } from "./src/consumer";

export const fastify = Fastify({
    logger: false
});

// CORS
fastify.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            "http://localhost:4269",
            "http://localhost:3000"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
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