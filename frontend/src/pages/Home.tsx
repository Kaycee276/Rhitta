import { TrendingUp, Music, Zap } from "lucide-react";
import SongCard from "../components/SongCard";
import SongCardSkeleton from "../components/SongCardSkeleton";
import { mockPlaylists } from "../data/mockData";
import { useSongStore } from "../store/songStore";

// import { usePlayerStore } from "../store/playerStore";
// import { TestComponent } from "../components/testComponent";

const Home = () => {
	// const { addToQueue } = usePlayerStore();
	const songs = useSongStore((s) => s.songs);
	const trendingSongs = [...songs]
		.sort((a, b) => b.playCount - a.playCount)
		.slice(0, 6);
	const recentSongs = [...songs].slice(0, 6);

	return (
		<div className="p-8 space-y-8">
			{/* Hero Section */}
			<div className="bg-linear-to-r from-(--accent-primary)/20 to-(--accent-primary)/10 rounded-2xl p-8 border border-(--accent-primary)/30">
				<h1 className="text-4xl font-bold mb-2">Welcome to Rhitta</h1>
				<p className="text-lg text-(--text-secondary) mb-6">
					Discover, stream, and own music on the blockchain
				</p>
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-(--accent-primary)" />
						<span className="text-sm text-(--text-secondary)">
							Real-time streaming powered by Somnia Data Streams
						</span>
					</div>
				</div>
			</div>
			{/* <TestComponent /> */}

			{/* Stats */}
			{/* <div className="grid-cols-1 md:grid-cols-4 gap-4 hidden md:grid">
				<div className="bg-(--bg-secondary) p-6 rounded-lg border border-(--border)">
					<div className="flex items-center gap-3 mb-2">
						<Music className="w-5 h-5 text-(--accent-primary)" />
						<span className="text-sm text-(--text-secondary)">Total Songs</span>
					</div>
					<p className="text-2xl font-bold">{songs.length}</p>
				</div>
				<div className="bg-(--bg-secondary) p-6 rounded-lg border border-(--border)">
					<div className="flex items-center gap-3 mb-2">
						<TrendingUp className="w-5 h-5 text-(--accent-primary)" />
						<span className="text-sm text-(--text-secondary)">Total Plays</span>
					</div>
					<p className="text-2xl font-bold">
						{songs
							.reduce((sum, song) => sum + song.playCount, 0)
							.toLocaleString()}
					</p>
				</div>
				<div className="bg-(--bg-secondary) p-6 rounded-lg border border-(--border)">
					<div className="flex items-center gap-3 mb-2">
						<Users className="w-5 h-5 text-(--accent-primary)" />
						<span className="text-sm text-(--text-secondary)">
							Active Listeners
						</span>
					</div>
					<p className="text-2xl font-bold">
						{songs.reduce((sum, song) => sum + song.listenerCount, 0)}
					</p>
				</div>
				<div className="bg-(--bg-secondary) p-6 rounded-lg border border-(--border)">
					<div className="flex items-center gap-3 mb-2">
						<Music className="w-5 h-5 text-(--accent-primary)" />
						<span className="text-sm text-(--text-secondary)">Playlists</span>
					</div>
					<p className="text-2xl font-bold">{mockPlaylists.length}</p>
				</div>
			</div> */}

			{/* Trending Now */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<TrendingUp className="w-6 h-6 text-(--accent-primary)" />
						Trending Now
					</h2>
					{/* <button className="text-sm text-(--accent-primary) hover:underline">
						See all
					</button> */}
				</div>
				<div className="space-y-2">
					{trendingSongs.length === 0 ? (
						<SongCardSkeleton />
					) : (
						trendingSongs.map((song) => <SongCard key={song.id} song={song} />)
					)}
				</div>
			</div>

			{/* Recently Added */}
			<div>
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold flex items-center gap-2">
						<Music className="w-6 h-6 text-(--accent-primary)" />
						Recently Added
					</h2>
					{/* <button className="text-sm text-(--accent-primary) hover:underline">
						See all
					</button> */}
				</div>
				<div className="space-y-2">
					{recentSongs.length === 0 ? (
						<SongCardSkeleton />
					) : (
						recentSongs.map((song) => <SongCard key={song.id} song={song} />)
					)}
				</div>
			</div>

			{/* Featured Playlists */}
			<div>
				<h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{mockPlaylists.map((playlist) => (
						<div
							key={playlist.id}
							className="bg-(--bg-secondary) rounded-lg overflow-hidden border border-(--border) hover:border-(--accent-primary)/50 transition-colors cursor-pointer group"
						>
							<div className="relative h-48 bg-linear-to-br from-(--accent-primary)/20 to-(--bg-tertiary)">
								<img
									src={playlist.coverArt}
									alt={playlist.name}
									className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
								/>
							</div>
							<div className="p-4">
								<h3 className="font-semibold mb-1">{playlist.name}</h3>
								<p className="text-sm text-(--text-secondary) mb-2">
									{playlist.description}
								</p>
								<p className="text-xs text-(--text-tertiary)">
									{playlist.playCount.toLocaleString()} plays
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
