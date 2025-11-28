import { useEffect, useRef } from "react";
import { usePlayerStore } from "../store/playerStore";

export const useWebAudioPlayer = (opts?: {
	onEnded?: () => void;
	initialVolume?: number;
}) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);

	const { playerState, setCurrentTime } = usePlayerStore();

	useEffect(() => {
		if (!audioRef.current) return;

		try {
			audioRef.current.crossOrigin = "anonymous";
		} catch {
			// ignore
		}

		if (!audioCtxRef.current) {
			const audioCtx = new AudioContext();
			audioCtxRef.current = audioCtx;

			try {
				const source = audioCtx.createMediaElementSource(audioRef.current);
				sourceRef.current = source;

				const gainNode = audioCtx.createGain();
				gainNode.gain.value = playerState.volume;
				gainNodeRef.current = gainNode;

				source.connect(gainNode).connect(audioCtx.destination);
			} catch (err) {
				console.error(
					"Failed to create MediaElementAudioSourceNode (CORS or other restriction):",
					err
				);
			}
		}
	}, [audioRef]);

	// Play / pause handling
	useEffect(() => {
		if (!audioRef.current || !audioCtxRef.current) return;

		if (audioCtxRef.current.state === "suspended") {
			audioCtxRef.current.resume();
		}

		if (playerState.isPlaying) {
			audioRef.current.play().catch(console.error);
		} else {
			audioRef.current.pause();
		}
	}, [playerState.isPlaying, playerState.currentSong]);

	// Volume control
	useEffect(() => {
		if (gainNodeRef.current) {
			gainNodeRef.current.gain.value = playerState.volume;
		}
	}, [playerState.volume]);

	// Track progress and ended callback
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const handleEnded = () => {
			if (typeof opts?.onEnded === "function") {
				opts.onEnded();
				return;
			}
		};

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [setCurrentTime, opts?.onEnded]);

	return { audioRef };
};
