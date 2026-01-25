import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyCookie from '@fastify/cookie';
import fastifyMetrics from "fastify-metrics";
import path from "path";

import { startRabbit } from "./rabbit";
import { authEndpoint } from "./src/endpoint";
//import { utilsEndpoint } from "./utils/database_manage";

export const fastify = Fastify({
    logger: false
});

// Metrics - Register BEFORE routes
fastify.register(fastifyMetrics, {
    endpoint: '/metrics',
	defaultMetrics: {enabled: true}
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
// add cookies!!!!
fastify.register(fastifyCookie);

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