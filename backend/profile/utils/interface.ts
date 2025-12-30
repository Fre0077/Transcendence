//AUTH interface
export interface RegisterBody { name: string; surname: string; username: string; email: string; password: string; }
export interface LoginBody { email: string; password: string; }
export interface GoogleAuthBody { email?: string; googleId?: string; name: string; surname: string; }

export interface userLogin {
	name:		String;
	surname:	String;
	username:	String;
	email:		String;
	password:	String;
	googleId:	number;
}

export interface newDataProfile {
	name:		String;
	surname:	String;
	username:	String;
	bio:		String;
	password:	String;
}

export interface auth2fa {
	code:		String;
	email:		String;
}

//CHAT interface
export interface NewChat {
	host:		number; //linkId creatore chat
	chatName:	String;
	members:	number[]; //linkId degli altri user
}

export interface NewMessage {
	message:	String;
	chatId:		number;
	linkId:		number;
}

export interface SrcChat {
	linkId:		number;
	chatName:	String;
}

//PROFILE interface
export interface changeProfile {
	userId:		number;
	newValue:	String;
}

export interface ProfileImage {
	userId:			number;
	imageBuffer:	Buffer;
}
