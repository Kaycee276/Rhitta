export interface Song {
	id: string;
	title: string;
	artist: string;
	artistId: string;
	coverArt?: string;
	audioUrl: string;
	genre: string;
}

export interface ReceivedSong {
	id: string;
	title?: string;
	artist?: string;
	artistId?: string;
	coverArt?: string;
	audioUrl?: string;
	genre?: string;
	receivedAt: number;
}
