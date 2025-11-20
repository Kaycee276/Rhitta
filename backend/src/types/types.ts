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
	artistId: string;
	coverArt?: string;
	audioUrl: string;
	genre: string;
}
