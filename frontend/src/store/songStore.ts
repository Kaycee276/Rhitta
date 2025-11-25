import { create } from "zustand";
import { mockSongs } from "../data/mockData";
import type { Song } from "../types";

type SongState = {
	songs: Song[];
	setSongs: (s: Song[]) => void;
	upsertSong: (partial: Partial<Song> & { id: string }) => void;
	reset: () => void;
};

export const useSongStore = create<SongState>((set, get) => ({
	songs: [...mockSongs],
	setSongs: (s) => set({ songs: s }),
	upsertSong: (partial) => {
		const songs = [...get().songs];
		const idx = songs.findIndex((x) => x.id === partial.id);
		const nowDate = new Date().toISOString().split("T")[0];
		const newSong: Song = {
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
			songs[idx] = { ...songs[idx], ...newSong };
		} else {
			songs.push(newSong);
		}

		set({ songs });
	},
	reset: () => set({ songs: [...mockSongs] }),
}));

export default useSongStore;
