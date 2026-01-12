import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";

import { startRabbit } from "./rabbit";
import { authEndpoint } from "./src/endpoint";
//import { utilsEndpoint } from "./utils/database_manage";

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
    root: path.join(process.cwd(), 'database/public/uploads'),
    prefix: '/uploads/',
});

// ENDPOINT SOLO AUTH
fastify.register(authEndpoint, { prefix: "/api" });
//fastify.register(utilsEndpoint, { prefix: "/api" });

// RICEZIONE DATI RABBITMQ (TEST)
startRabbit();

// Start server
fastify.listen({ port: 3001, host: process.env.HOST }, (err, address) => {
    if (err) throw err;
    console.log(`Auth server online → ${address}`);
});