/* ------------------- Ball Class ------------------- */
/* all data relative to the ball */

export default class Ball
{
	public pos:number[];			/* coordinates (x,y) of the ball */
	public angle:number;			/* angle on which the ball is moving (clamped 0 -> 2PI) */
	public speed:number;			/* module of the peed */

	constructor () {
		this.angle = 0;
		this.pos = [0.5, 0.5];
		this.speed = 0.01;
	}

	// resets the parameters to the default ones
	public reset() {
		this.angle = 0;
		this.pos = [0.5, 0.5];
		this.speed = 0.01;
	}

	// this function bounces ann object that changes the X
	// component of the ball's direction
	// @offsetDeg is the angle we want to add to a perfect reflection
	public bounceX(offsetDeg:number = 0) {

		// convert offset to radians
		const delta = offsetDeg * (Math.PI / 180);

		// perfect reflection off vertical wall
		const perfectReflection = Math.PI - this.angle;
	
		// apply your custom offset
		this.angle = perfectReflection + delta;
		this.angle = Ball.clamp(this.angle);
	}

	public bounceY(offsetDeg:number = 0) {

		// convert offset to radians
		const delta = offsetDeg * (Math.PI / 180);

		// perfect reflection off vertical wall
		const perfectReflection = -this.angle;

		// apply your custom offset
		this.angle = perfectReflection + delta;
		this.angle = Ball.clamp(this.angle);
	}

	public static clamp(angle:number): number {

		if (angle < 0)
			angle = (2 * Math.PI) + angle % (2 * Math.PI);
		if (angle > (2 * Math.PI))
			angle = angle % (2 * Math.PI) - (2 * Math.PI);
		return angle;
	}
}