import { create } from "zustand";
import type { PlayerState, Song } from "../types";

interface PlayerStore {
	playerState: PlayerState;
	audioRef: React.RefObject<HTMLAudioElement | null> | null;
	setAudioRef: (ref: React.RefObject<HTMLAudioElement | null>) => void;
	playSong: (song: Song) => void;
	togglePlayPause: () => void;
	setCurrentTime: (time: number) => void;
	setVolume: (volume: number) => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
	nextSong: () => void;
	previousSong: () => void;
	addToQueue: (song: Song) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	playerState: {
		currentSong: null,
		isPlaying: false,
		currentTime: 0,
		volume: 1,
		queue: [],
		shuffle: false,
		repeat: "off",
	},
	audioRef: null,
	setAudioRef: (ref) => set({ audioRef: ref }),
	playSong: (song) =>
		set((prev) => {
			const isInQueue = prev.playerState.queue.some((s) => s.id === song.id);
			return {
				playerState: {
					...prev.playerState,
					currentSong: song,
					isPlaying: true,
					queue: isInQueue
						? prev.playerState.queue
						: [...prev.playerState.queue, song],
				},
			};
		}),
	togglePlayPause: () =>
		set((prev) => ({
			playerState: {
				...prev.playerState,
				isPlaying: !prev.playerState.isPlaying,
			},
		})),
	setCurrentTime: (time) => {
		const audio = get().audioRef?.current;
		if (audio) {
			audio.currentTime = time;
		}
		set((prev) => ({
			playerState: { ...prev.playerState, currentTime: time },
		}));
	},
	setVolume: (volume) => {
		const audio = get().audioRef?.current;
		if (audio) {
			audio.volume = volume;
		}
		set((prev) => ({ playerState: { ...prev.playerState, volume } }));
	},
	toggleShuffle: () =>
		set((prev) => ({
			playerState: { ...prev.playerState, shuffle: !prev.playerState.shuffle },
		})),
	toggleRepeat: () =>
		set((prev) => {
			const repeatOrder: ("off" | "one" | "all")[] = ["off", "all", "one"];
			const currentIndex = repeatOrder.indexOf(prev.playerState.repeat);
			const nextIndex = (currentIndex + 1) % repeatOrder.length;
			return {
				playerState: { ...prev.playerState, repeat: repeatOrder[nextIndex] },
			};
		}),
	nextSong: () =>
		set((prev) => {
			const state = prev.playerState;
			if (state.queue.length === 0) return prev;
			const currentIndex = state.queue.findIndex(
				(s) => s.id === state.currentSong?.id
			);
			let next: Song | null = null;
			if (state.shuffle) {
				const randomIndex = Math.floor(Math.random() * state.queue.length);
				next = state.queue[randomIndex];
			} else if (currentIndex < state.queue.length - 1) {
				next = state.queue[currentIndex + 1];
			} else if (state.repeat === "all") {
				next = state.queue[0];
			}
			if (!next) return prev;
			return { playerState: { ...state, currentSong: next, isPlaying: true } };
		}),
	previousSong: () =>
		set((prev) => {
			const state = prev.playerState;
			if (state.queue.length === 0) return prev;
			const currentIndex = state.queue.findIndex(
				(s) => s.id === state.currentSong?.id
			);
			let prevSong: Song | null = null;
			if (currentIndex > 0) {
				prevSong = state.queue[currentIndex - 1];
			} else if (state.repeat === "all") {
				prevSong = state.queue[state.queue.length - 1];
			}
			if (!prevSong) return prev;
			return {
				playerState: { ...state, currentSong: prevSong, isPlaying: true },
			};
		}),
	addToQueue: (song) =>
		set((prev) => ({
			playerState: {
				...prev.playerState,
				queue: [...prev.playerState.queue, song],
			},
		})),
}));
