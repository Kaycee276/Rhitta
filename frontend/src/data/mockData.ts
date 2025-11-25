import type { Song, Playlist } from "../types";

export const mockSongs: Song[] = [
	{
		id: "1",
		title: "Midnight Dreams",
		artist: "Echo Nova",
		artistId: "artist1",
		duration: 245,
		coverArt:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
		playCount: 12543,
		listenerCount: 234,
		price: "0.05",
		nftTokenId: "1",
		contractAddress: "0x123...",
		likes: 892,
		isLiked: false,
		releaseDate: "2025-01-15",
		genre: "Electronic",
	},
	{
		id: "2",
		title: "Neon Nights",
		artist: "Synth Wave",
		artistId: "artist2",
		duration: 198,
		coverArt:
			"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
		playCount: 9876,
		listenerCount: 156,
		price: "0.03",
		nftTokenId: "2",
		contractAddress: "0x123...",
		likes: 654,
		isLiked: true,
		releaseDate: "2025-01-10",
		genre: "Synthwave",
	},
	{
		id: "3",
		title: "Cosmic Drift",
		artist: "Space Echo",
		artistId: "artist3",
		duration: 312,
		coverArt:
			"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
		playCount: 15234,
		listenerCount: 421,
		price: "0.08",
		nftTokenId: "3",
		contractAddress: "0x123...",
		likes: 1234,
		isLiked: false,
		releaseDate: "2025-01-05",
		genre: "Ambient",
	},
	{
		id: "4",
		title: "Digital Pulse",
		artist: "Echo Nova",
		artistId: "artist1",
		duration: 267,
		coverArt:
			"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
		playCount: 8765,
		listenerCount: 189,
		price: "0.04",
		nftTokenId: "4",
		contractAddress: "0x123...",
		likes: 567,
		isLiked: true,
		releaseDate: "2025-01-12",
		genre: "Electronic",
	},
	{
		id: "5",
		title: "Electric Storm",
		artist: "Thunder Beats",
		artistId: "artist4",
		duration: 223,
		coverArt:
			"https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
		playCount: 11234,
		listenerCount: 298,
		price: "0.06",
		nftTokenId: "5",
		contractAddress: "0x123...",
		likes: 789,
		isLiked: false,
		releaseDate: "2025-01-08",
		genre: "EDM",
	},
	{
		id: "6",
		title: "Stellar Journey",
		artist: "Space Echo",
		artistId: "artist3",
		duration: 289,
		coverArt:
			"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500",
		audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
		playCount: 9876,
		listenerCount: 167,
		price: "0.07",
		nftTokenId: "6",
		contractAddress: "0x123...",
		likes: 432,
		isLiked: false,
		releaseDate: "2025-01-03",
		genre: "Ambient",
	},
];

export const mockPlaylists: Playlist[] = [
	{
		id: "playlist1",
		name: "Trending Now",
		description: "The hottest tracks on Rhitta right now",
		coverArt:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
		songIds: ["1", "2", "3", "4"],
		createdBy: "Rhitta",
		createdAt: "2025-01-15",
		playCount: 45678,
	},
	{
		id: "playlist2",
		name: "Electronic Vibes",
		description: "Best electronic music collection",
		coverArt:
			"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
		songIds: ["1", "4", "5"],
		createdBy: "Rhitta",
		createdAt: "2025-01-14",
		playCount: 23456,
	},
	{
		id: "playlist3",
		name: "Chill Space",
		description: "Relaxing ambient sounds",
		coverArt:
			"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
		songIds: ["3", "6"],
		createdBy: "Rhitta",
		createdAt: "2025-01-13",
		playCount: 12345,
	},
];

// Helper to upsert a song into the mockSongs array. This mutates the exported array so
// UI that imports `mockSongs` will see updates (works for development/mocks).
import type { Song as SongType } from "../types";

export function upsertMockSong(
	partial: Partial<SongType> & { id: string; title?: string }
) {
	const idx = mockSongs.findIndex((s) => s.id === partial.id);
	const nowDate = new Date().toISOString().split("T")[0];
	const newSong: SongType = {
		id: partial.id,
		title: partial.title ?? partial.id,
		artist: partial.artist ?? "Unknown",
		artistId: partial.artistId ?? "unknown",
		duration: typeof partial.duration === "number" ? partial.duration : 0,
		coverArt: partial.coverArt ?? "",
		audioUrl: partial.audioUrl ?? "",
		playCount: typeof partial.playCount === "number" ? partial.playCount : 0,
		listenerCount:
			typeof partial.listenerCount === "number" ? partial.listenerCount : 0,
		price: partial.price ?? "0",
		nftTokenId: partial.nftTokenId,
		contractAddress: partial.contractAddress,
		likes: typeof partial.likes === "number" ? partial.likes : 0,
		isLiked: typeof partial.isLiked === "boolean" ? partial.isLiked : false,
		releaseDate: partial.releaseDate ?? nowDate,
		genre: partial.genre ?? "",
	};

	if (idx >= 0) {
		mockSongs[idx] = { ...mockSongs[idx], ...newSong };
	} else {
		mockSongs.push(newSong);
	}
}
