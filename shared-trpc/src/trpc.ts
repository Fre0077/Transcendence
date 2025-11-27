import { initTRPC } from '@trpc/server';
import { z } from 'zod';


// Define the shape of the context that your router will receive
export type Context = {
	func: (details: any) => null; // adjust return type to your Game type
};


/* ! ! ! IMPORTANT ! ! ! */
/* THIS MUST BE THE SAME AS gameDetails type IN 'game/src/index.ts' */

// Define input schema with Zod
const addGameInputSchema = z.object({
	ID: z.string(),
	format: z.number(),
	players: z.array(z.string()),
});

// const closeGameInputSchema = z.object({
// 	ID: z.string(),
// 	format: z.number(),
// 	players: z.array(z.string()),
// });

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create();

export const gameRouter = t.router({
	health: t.procedure
		.query(() => {
			return {message: 'ok' };
		}),
	hello: t.procedure									// define the procedure
		.input(z.object({ name: z.string() }))			// define the input expected
		.query(({ input }) => {							// define how it will be called in the client
			return { message: `Hello ${input.name}!` };
		}),
	createGame: t.procedure
		.input(addGameInputSchema)
		.mutation(({ input, ctx }) => {
			return ctx.func(input); // input is now properly typed
    }),
});

export const lobbyRouter = t.router({
	health: t.procedure
		.query(() => {
			return {message: 'ok' };
		}),
	endGame: t.procedure
		.input(z.string())
		.mutation(({ input, ctx }) => {
			return ctx.func(input); // input is now properly typed
    }),
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export type GameRouter = typeof gameRouter;
export type LobbyRouter = typeof lobbyRouter;