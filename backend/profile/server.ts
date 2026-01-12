import Fastify from "fastify";
import cors from "@fastify/cors";


import { startRabbit } from "./rabbit";
import { profileEndpoint } from "./src/endpoint";
import { startprofileConsumer } from "./src/consumer";

export const fastify = Fastify({
    logger: false
});

// Registro cors
fastify.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            "http://localhost:4269",
            "http://localhost:3000",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true, // se usi cookie o autenticazione
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
});

fastify.addContentTypeParser(
    "text/plain",
    { parseAs: "string" },
    function (req, body, done) {
        done(null, body);
    }
);

fastify.register(profileEndpoint, { prefix: '/api' });

// RICEZIONE DATI RABBITMQ (TEST)
startRabbit();
startprofileConsumer();

fastify.listen({ port: 3003, host: process.env.HOST }, (err, address) => {
    if (err) throw err;
    console.log(`Profile Server online → ${address}`);
});