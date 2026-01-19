import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from '@fastify/cookie';


import { startRabbit } from "./rabbit";
import { profileEndpoint } from "./src/endpoint";
import { startprofileConsumer } from "./src/consumer";

export const fastify = Fastify({
    logger: false
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
    credentials: true,  // 🔥 REQUIRED 4 Cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
});

fastify.addContentTypeParser(
    "text/plain",
    { parseAs: "string" },
    function (req, body, done) {
        done(null, body);
    }
);

fastify.register(fastifyCookie);
fastify.register(profileEndpoint, { prefix: '/api' });

// RICEZIONE DATI RABBITMQ (TEST)
startRabbit();
startprofileConsumer();

fastify.listen({ port: 3003, host: process.env.HOST }, (err, address) => {
    if (err) throw err;
    console.log(`Profile Server online → ${address}`);
});