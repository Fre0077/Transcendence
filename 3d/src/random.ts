
// Source - https://stackoverflow.com/a
// Posted by user40521
// Retrieved 2025-11-11, License - CC BY-SA 3.0

function seconds_since_epoch(){ return Math.floor( Date.now() / 1000 ) }

/* returns a pseudo random number based on time.
The number will be from 0 to max (max excluded) */
export function randIntT(max: number = 2147483648) {
	let rand = seconds_since_epoch() % max;
	// console.log(`randIntT with max ${max} got ${rand}`);
	return rand;
}

/* returns a pseudo random number using the Math.random()
function. The number will be from 0 to max (max excluded) */
export function randIntM(max:number = 2147483648) {
	return Math.floor(Math.random() * max);
}

export function randFloatM(max:number = 2147483648) {
	return Math.random() * max;
}
