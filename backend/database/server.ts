import Fastify from "fastify";
import cors from "@fastify/cors";
import { chatEndpoint } from "./endpoint/chat";
import { userEndpoint } from "./endpoint/user";

const fastify = Fastify();

fastify.register(cors, {
	origin: (origin, cb) => {
		const allowedOrigins = [
			"http://localhost:4269", // frontend
			"http://localhost:3000", // eventualmente anche il backend stesso
		];

		if (!origin || allowedOrigins.includes(origin)) {
			cb(null, true); // ok
		} else {
			cb(new Error("Not allowed by CORS"), false);
		}
	},
	credentials: true, // se usi cookie o autenticazione
});

fastify.addContentTypeParser(
	"text/plain",
	{ parseAs: "string" },
	function (req, body, done) {
		done(null, body);
	}
);

// ENDPOINT PER GESTIRE LE REQUEST
fastify.register(chatEndpoint);
fastify.register(userEndpoint);

// Avvia il server
fastify.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
	if (err) throw err;
	console.log(`Server Fastify avviato su ${address}`);
});



