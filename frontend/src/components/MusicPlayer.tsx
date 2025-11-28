import {
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Shuffle,
	Repeat,
	Volume2,
	Heart,
	MoreHorizontal,
} from "lucide-react";
import { useEffect } from "react";
import { usePlayerStore } from "../store/playerStore";
import { formatTime } from "../utils/formatTime";
import { useWebAudioPlayer } from "../hooks/useWebAudioPlayer";

const MusicPlayer = () => {
	const { audioRef } = useWebAudioPlayer({
		onEnded: () => {
			if (audioRef.current) {
				if (playerState.repeat === "one") {
					audioRef.current.currentTime = 0;
					audioRef.current.play().catch(console.error);
					return;
				}
			}
			nextSong();
		},
	});
	const {
		playerState,
		togglePlayPause,
		setCurrentTime,
		setVolume,
		toggleShuffle,
		toggleRepeat,
		nextSong,
		previousSong,
		setAudioRef,
	} = usePlayerStore();

	useEffect(() => {
		setAudioRef(audioRef);
	}, [setAudioRef]);

	useEffect(() => {
		if (!audioRef.current) return;
		audioRef.current.load();
		if (playerState.isPlaying) {
			audioRef.current.play().catch(console.error);
		} else {
			audioRef.current.pause();
		}
	}, [playerState.isPlaying, playerState.currentSong]);

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = playerState.volume;
		}
	}, [playerState.volume]);

	// Note: timeupdate is handled by useWebAudioPlayer; ended behavior is provided
	// to the hook via the onEnded callback passed above, so we don't add listeners here.

	const hasSong = Boolean(playerState.currentSong);

	const songDuration = playerState.currentSong?.duration ?? 0;
	const progress = songDuration
		? (playerState.currentTime / songDuration) * 100
		: 0;

	const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!playerState.currentSong) return;
		const newTime = (parseFloat(e.target.value) / 100) * songDuration;
		setCurrentTime(newTime);
	};

	return (
		<div className="fixed  left-0 right-0 bg-(--bg-secondary) border-t border-(--border) z-50 bottom-[80px] md:bottom-0 ">
			<audio
				ref={audioRef}
				src={playerState.currentSong?.audioUrl}
				preload="auto"
				crossOrigin="anonymous"
				// controls={false}
			/>
			{/* Progress Bar */}
			<div className="h-1 bg-(--bg-tertiary) cursor-pointer group">
				<div
					className="h-full bg-(--accent-primary) transition-all"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className="flex flex-row items-center justify-between gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:px-6">
				{/* Song Info */}
				<div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
					{hasSong && (
						<img
							src={playerState.currentSong!.coverArt}
							alt={playerState.currentSong!.title}
							className="w-12 h-12 md:w-14 md:h-14 rounded object-cover shrink-0"
						/>
					)}
					<div className="min-w-0 flex-1">
						<h4 className="font-medium text-(--text) truncate text-sm md:text-base">
							{playerState.currentSong?.title ?? ""}
						</h4>
						<p className="text-xs md:text-sm text-(--text-secondary) truncate">
							{playerState.currentSong?.artist ?? ""}
						</p>
					</div>
					<button className="hidden sm:inline-flex p-2 hover:text-(--accent-primary) transition-colors">
						<Heart
							className={`w-5 h-5 ${
								playerState.currentSong?.isLiked
									? "fill-(--accent-primary) text-(--accent-primary)"
									: ""
							}`}
						/>
					</button>
				</div>

				{/* Player Controls */}
				<div className="flex flex-col items-center gap-2 w-auto md:w-auto md:flex-1">
					<div className="flex items-center justify-center gap-2">
						{/* Shuffle Button */}
						<button
							onClick={toggleShuffle}
							className={`p-2 rounded-full transition-colors hidden md:block ${
								playerState.shuffle
									? "text-(--accent-primary)"
									: "text-(--text-secondary) hover:text-(--text)"
							}`}
						>
							<Shuffle className="w-5 h-5" />
						</button>
						{/* Previous Button */}
						<button
							onClick={previousSong}
							className="p-2 text-(--text-secondary) hover:text-(--text) transition-colors "
						>
							<SkipBack className="w-5 h-5" />
						</button>
						{/* Play/Pause Button */}
						<button
							onClick={togglePlayPause}
							className="p-3 bg-(--accent-primary) hover:bg-(--accent-dark) text-white rounded-full transition-colors "
						>
							{playerState.isPlaying ? (
								<Pause className="w-5 h-5" />
							) : (
								<Play className="w-5 h-5 ml-0.5" />
							)}
						</button>
						{/* Next Button */}
						<button
							onClick={nextSong}
							className="p-2 text-(--text-secondary) hover:text-(--text) transition-colors "
						>
							<SkipForward className="w-5 h-5" />
						</button>
						{/* Repeat Button */}
						<button
							onClick={toggleRepeat}
							className={`p-2 rounded-full transition-colors hidden md:block ${
								playerState.repeat !== "off"
									? "text-(--accent-primary)"
									: "text-(--text-secondary) hover:text-(--text)"
							}`}
						>
							<Repeat className="w-5 h-5" />
						</button>
					</div>
					<div className=" items-center gap-2 w-full text-xs text-(--text-tertiary) hidden md:flex">
						<span>{formatTime(playerState.currentTime)}</span>
						{/* Progress Bar */}
						<input
							type="range"
							min="0"
							max="100"
							value={hasSong ? progress : 0}
							onChange={handleProgressChange}
							className="flex-1 h-1 bg-(--bg-tertiary) rounded-lg appearance-none cursor-pointer accent-(--accent-primary)"
						/>
						<span>{formatTime(playerState.currentSong?.duration ?? 0)}</span>
					</div>
				</div>

				{/* Volume & More */}
				<div className=" items-center justify-end gap-3 w-full md:w-auto md:flex-1 hidden md:flex">
					<button className="hidden md:inline-flex p-2 text-(--text-secondary) hover:text-(--text) transition-colors">
						<MoreHorizontal className="w-5 h-5" />
					</button>
					<div className="flex items-center gap-2 w-28 md:w-32">
						<Volume2 className="w-5 h-5 text-(--text-secondary) hidden sm:block" />
						<input
							type="range"
							min="0"
							max="1"
							step="0.01"
							value={playerState.volume}
							onChange={(e) => setVolume(parseFloat(e.target.value))}
							className="flex-1 h-1 bg-(--bg-tertiary) rounded-lg appearance-none cursor-pointer accent-(--accent-primary)"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MusicPlayer;
