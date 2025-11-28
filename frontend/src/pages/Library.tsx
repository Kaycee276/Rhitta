import { BookOpen, Heart, Music } from "lucide-react";
import SongCard from "../components/SongCard";
import SongCardSkeleton from "../components/SongCardSkeleton";
import { useSongStore } from "../store/songStore";

const Library = () => {
	const songs = useSongStore((s) => s.songs);
	const likedSongs = songs.filter((song) => song.isLiked);

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center gap-3 mb-8">
				<BookOpen className="w-8 h-8 text-(--accent-primary)" />
				<h1 className="text-3xl font-bold">Your Library</h1>
			</div>

			{/* Liked Songs */}
			<div>
				<div className="flex items-center gap-2 mb-6">
					<Heart className="w-6 h-6 text-(--accent-primary) fill-(--accent-primary)" />
					<h2 className="text-2xl font-bold">Liked Songs</h2>
					<span className="text-sm text-(--text-secondary)">
						({likedSongs.length} songs)
					</span>
				</div>
				{likedSongs.length > 0 ? (
					<div className="space-y-2">
						{likedSongs.map((song) => (
							<SongCard key={song.id} song={song} />
						))}
					</div>
				) : (
					<div className="text-center py-12 text-(--text-secondary)">
						<Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<p>This feature is not yet available </p>
					</div>
				)}
			</div>

			{/* All Songs */}
			<div>
				<div className="flex items-center gap-2 mb-6">
					<Music className="w-6 h-6 text-(--accent-primary)" />
					<h2 className="text-2xl font-bold">All Songs</h2>
					<span className="text-sm text-(--text-secondary)">
						({songs.length} songs)
					</span>
				</div>
				<div className="space-y-2">
					{songs.length === 0 ? (
						<SongCardSkeleton />
					) : (
						songs.map((song) => <SongCard key={song.id} song={song} />)
					)}
				</div>
			</div>
		</div>
	);
};

export default Library;
