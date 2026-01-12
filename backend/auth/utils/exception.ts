import { logError } from "./logger";

export class BadRequest extends Error {
	statusCode: number;
	source: String;

	constructor(message = "The server could not understand the request due to invalid syntax", source = "Generic", statusCode = 400) {
		super(message);
		this.name = "BadRequest";
		this.statusCode = statusCode;
		this.source = source;
		this.log();
	}

	private log() {
		logError(`{${this.source}} [${this.statusCode}] ${this.message}`);
	}
}

export class Unauthorized extends Error {
	statusCode: number;
	source: String;

	constructor(message = "Authentication is required and has failed or has not been provided", source = "Generic", statusCode = 401) {
		super(message);
		this.name = "Unauthorized";
		this.statusCode = statusCode;
		this.source = source;
		this.log();
	}

	private log() {
		logError(`{${this.source}} [${this.statusCode}] ${this.message}`);
	}
}

export class Forbidden extends Error {
	statusCode: number;
	source: String;

	constructor(message = "The server understood the request but refuses to authorize it", source = "Generic", statusCode = 403) {
		super(message);
		this.name = "Forbidden";
		this.statusCode = statusCode;
		this.source = source;
		this.log();
	}

	private log() {
		logError(`{${this.source}} [${this.statusCode}] ${this.message}`);
	}
}

export class NotFound extends Error {
	statusCode: number;
	source: String;

	constructor(message = "The server cannot find the requested resource", source = "Generic", statusCode = 404) {
		super(message);
		this.name = "NotFound";
		this.statusCode = statusCode;
		this.source = source;
		this.log();
	}

	private log() {
		logError(`{${this.source}} [${this.statusCode}] ${this.message}`);
	}
}

export class Conflict extends Error {
	statusCode: number;
	source: String;

	constructor(message = "The request conflicts with the current state of the server", source = "Generic", statusCode = 409) {
		super(message);
		this.name = "Conflict";
		this.statusCode = statusCode;
		this.source = source;
		this.log();
	}

	private log() {
		logError(`{${this.source}} [${this.statusCode}] ${this.message}`);
	}
}
