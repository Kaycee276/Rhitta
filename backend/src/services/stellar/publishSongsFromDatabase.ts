import prisma from "../../utils/prisma.ts";
import { publishSong } from "./stellarService.ts";

export async function publishAllSongsFromDatabase() {
	console.log("Fetching unpublished songs from database...");
	const songs = await prisma.song.findMany({
		where: { published: false },
	});

	if (songs.length === 0) {
		console.log("No unpublished songs found in database.");
		return { count: 0 };
	}

	console.log(
		`Found ${songs.length} unpublished songs. Publishing to Stellar...`
	);

	let publishedCount = 0;
	for (const song of songs) {
		try {
			await publishSong({
				id: song.id,
				title: song.title,
				artist: song.artist ?? undefined,
				artist_id: song.artistId ?? undefined,
				cover_art: song.coverArt ?? undefined,
				audio_url: song.audioUrl,
				genre: song.genre ?? undefined,
				duration: song.duration,
				price: song.price,
			});
			await markSongAsPublished(song.id);
			publishedCount++;
		} catch (err) {
			console.error(`Failed to publish song ID ${song.id}:`, err);
		}
	}

	console.log(
		`Finished publishing ${publishedCount}/${songs.length} songs to Stellar!`
	);
	return { count: publishedCount, total: songs.length };
}

export async function markSongAsPublished(songId: string) {
	try {
		await prisma.song.update({
			where: { id: songId },
			data: { published: true },
		});
	} catch (error) {
		console.error(`Failed to mark song ${songId} as published:`, error);
	}
}

// Backward compatibility alias
export const publishAllSongsFromSupabase = publishAllSongsFromDatabase;
