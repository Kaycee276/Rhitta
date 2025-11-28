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
	duration: number;
	playCount?: number;
	listenerCount?: number;
	price?: string;
	nftTokenId?: string;
	contractAddress?: string;
	likes?: number;
	isLiked?: boolean;
	receivedAt: number;
}
