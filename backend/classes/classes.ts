export interface userLogin {
	name: String;
	surname: String;
	username: String;
	email: String;
	password: String;
}

export interface newChat {
	host: number;
	chatName: String;
	members: number[];
}

export interface newMessage {
	message: String;
	chatId: number;
	userId: number;
}

export interface srcChat {
	userId: number;
	chatName: String;
}

export interface changeProfile {
	userId: number;
	newValue: String;
}
