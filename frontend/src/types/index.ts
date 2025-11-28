export interface Song {
	id: string;
	title: string;
	artist: string;
	artistId: string;
	duration: number; // in seconds
	coverArt: string;
	audioUrl: string;
	playCount: number;
	listenerCount: number;
	price: string;
	nftTokenId?: string;
	contractAddress?: string;
	likes: number;
	isLiked?: boolean;
	releaseDate: string;
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
}

export interface Artist {
	id: string;
	name: string;
	avatar: string;
	bio: string;
	totalPlays: number;
	totalEarnings: string;
	followerCount: number;
	songCount: number;
}

export interface Playlist {
	id: string;
	name: string;
	description: string;
	coverArt: string;
	songIds: string[];
	createdBy: string;
	createdAt: string;
	playCount: number;
}

export interface PlayerState {
	currentSong: Song | null;
	isPlaying: boolean;
	currentTime: number;
	volume: number;
	queue: Song[];
	shuffle: boolean;
	repeat: "off" | "one" | "all";
}
