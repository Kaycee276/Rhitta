import { Music, Filter } from "lucide-react";
import SongCard from "../components/SongCard";
import { mockSongs } from "../data/mockData";

const Discover = () => {
	const genres = ["All", "Electronic", "Synthwave", "Ambient", "EDM"];

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold flex items-center gap-3">
					<Music className="w-8 h-8 text-(--accent-primary)" />
					Discover Music
				</h1>
				<button className="flex items-center gap-2 px-4 py-2 bg-(--bg-tertiary) hover:bg-(--bg-secondary) border border-(--border) rounded-lg transition-colors">
					<Filter className="w-4 h-4" />
					Filter
				</button>
			</div>

			{/* Genre Filter */}
			<div className="flex items-center gap-3 flex-wrap">
				{genres.map((genre) => (
					<button
						key={genre}
						className={`px-4 py-2 rounded-full transition-colors ${
							genre === "All"
								? "bg-(--accent-primary) text-white"
								: "bg-(--bg-secondary) text-(--text-secondary) hover:bg-(--bg-tertiary) hover:text-(--text) border border-(--border)"
						}`}
					>
						{genre}
					</button>
				))}
			</div>

			{/* All Songs */}
			<div>
				<h2 className="text-xl font-semibold mb-4">All Songs</h2>
				<div className="space-y-2">
					{mockSongs.map((song) => (
						<SongCard key={song.id} song={song} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Discover;
