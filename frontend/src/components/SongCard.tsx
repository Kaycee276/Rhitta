import { Play, Heart, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import type { Song } from "../types";
import { usePlayerStore } from "../store/playerStore";
import { formatTime } from "../utils/formatTime";
import RealTimeListenerCount from "./RealTimeListenerCount";
// import { addNotification } from "../utils/notifications";

interface SongCardProps {
	song: Song;
	showPlayCount?: boolean;
	showListenerCount?: boolean;
}

const SongCard = ({
	song,
	showPlayCount = true,
	showListenerCount = true,
}: SongCardProps) => {
	const { playSong, playerState } = usePlayerStore();
	const isCurrentlyPlaying = playerState.currentSong?.id === song.id;
	const bounceDots = [0, 1, 2];

	const handlePlay = () => {
		playSong(song);
		// addNotification("Voila", "You just played a song", "success");
	};

	return (
		<div
			className={`group flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-(--bg-tertiary) transition-colors cursor-pointer ${
				isCurrentlyPlaying ? "bg-(--bg-tertiary)" : ""
			}`}
		>
			{/* Cover Art */}
			<div className="relative w-16 h-16 sm:w-14 sm:h-14 shrink-0">
				<img
					src={song.coverArt}
					alt={song.title}
					className="w-full h-full rounded object-cover"
				/>
				<button
					onClick={handlePlay}
					className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity"
				>
					{isCurrentlyPlaying && playerState.isPlaying ? (
						<div className="flex items-end gap-1">
							{bounceDots.map((dot) => (
								<motion.span
									key={dot}
									className="w-2 h-2 bg-(--accent-primary) rounded-full"
									animate={{ y: [0, -3, 0] }}
									transition={{
										duration: 0.6,
										repeat: Infinity,
										repeatDelay: 0,
										delay: dot * 0.12,
										ease: "easeInOut",
									}}
								/>
							))}
						</div>
					) : (
						<Play className="w-5 h-5 text-white fill-white" />
					)}
				</button>
			</div>

			{/* Song Info */}
			<div className="flex-1 min-w-0 w-full">
				<h4
					className={`font-medium truncate ${
						isCurrentlyPlaying ? "text-(--accent-primary)" : "text-(--text)"
					}`}
				>
					{song.title}
				</h4>
				<p className="text-sm text-(--text-secondary) truncate">
					{song.artist}
				</p>
				{showPlayCount && (
					<div className="flex items-center gap-4 mt-1 text-xs text-(--text-tertiary)">
						<span>{song.playCount.toLocaleString()} plays</span>
						{showListenerCount && <RealTimeListenerCount songId={song.id} />}
					</div>
				)}
			</div>

			{/* Duration & Actions */}
			<div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
				<span className="text-sm text-(--text-tertiary) whitespace-nowrap">
					{formatTime(song.duration)}
				</span>
				<div className="flex items-center gap-2 sm:gap-3">
					<button className="p-2 hover:text-(--accent-primary) transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
						<Heart
							className={`w-5 h-5 ${
								song.isLiked
									? "fill-(--accent-primary) text-(--accent-primary) opacity-100"
									: ""
							}`}
						/>
					</button>
					<button className="p-2 hover:text-(--text) transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
						<MoreHorizontal className="w-5 h-5 text-(--text-secondary)" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default SongCard;
