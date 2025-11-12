import { TrendingUp, Flame, Clock } from "lucide-react";
import SongCard from "../components/SongCard";
import { mockSongs } from "../data/mockData";

const Trending = () => {
	const trendingSongs = [...mockSongs]
		.sort((a, b) => b.playCount - a.playCount)
		.map((song, index) => ({ ...song, rank: index + 1 }));

	const hotSongs = [...mockSongs]
		.sort((a, b) => b.listenerCount - a.listenerCount)
		.slice(0, 5);

	return (
		<div className="p-8 space-y-8">
			<div className="flex items-center gap-3 mb-8">
				<TrendingUp className="w-8 h-8 text-(--accent-primary)" />
				<h1 className="text-3xl font-bold">Trending Charts</h1>
			</div>

			{/* Hot Right Now */}
			<div className="bg-linear-to-r from-(--accent-primary)/20 to-(--accent-primary)/10 rounded-2xl p-6 border border-(--accent-primary)/30">
				<div className="flex items-center gap-2 mb-6">
					<Flame className="w-6 h-6 text-(--accent-primary)" />
					<h2 className="text-2xl font-bold">Hot Right Now</h2>
				</div>
				<div className="space-y-2">
					{hotSongs.map((song, index) => (
						<div key={song.id} className="flex items-center gap-4">
							<div className="w-8 text-center font-bold text-(--accent-primary)">
								#{index + 1}
							</div>
							<SongCard
								song={song}
								showPlayCount={true}
								showListenerCount={true}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Top Charts */}
			<div>
				<div className="flex items-center gap-2 mb-6">
					<Clock className="w-6 h-6 text-(--accent-primary)" />
					<h2 className="text-2xl font-bold">Top Charts</h2>
				</div>
				<div className="space-y-2">
					{trendingSongs.map((song) => (
						<div key={song.id} className="flex items-center gap-4">
							<div className="w-12 text-center font-bold text-(--text-tertiary)">
								#{song.rank}
							</div>
							<SongCard
								song={song}
								showPlayCount={true}
								showListenerCount={false}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Trending;
