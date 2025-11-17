export interface StreamEvent {
	songId: string;
	eventType: "play" | "purchase" | "like" | "comment";
	timestamp: number;
	data: Record<string, any>;
}

export interface Song {
	id: string;
	title: string;
	artist: string;
	ipfsHash: string;
	creator: string;
	maxSupply: number;
	currentSupply: number;
	price: number;
	createdAt: number;
}
