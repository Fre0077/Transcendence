import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { GameRouter } from 'shared-trpc';

// TRPC Client
export function getGameService(url:string): any {
	return createTRPCProxyClient<GameRouter>({
	  links: [
		httpBatchLink({
		  url: url,
		  async fetch(url, options) {
			try {
			  const res = await fetch(url, options);
			  if (!res.ok) {
				console.error('tRPC server responded with status', res.status);
			  }
			  return res;
			} catch (err) {
			  console.error('tRPC network error: server unreachable', err);
			  throw err; // important to rethrow
			}
		  },
		}),
	  ],
	});
}