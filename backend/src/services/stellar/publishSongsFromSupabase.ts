import { supabase } from "../../utils/supabase.ts";
import { publishSong } from "./stellarService.ts";

export async function publishAllSongsFromSupabase() {
	console.log("Fetching unpublished songs from Supabase...");
	const { data: songs, error } = await supabase
		.from("songs")
		.select("*")
		.eq("published", false);

	if (error) {
		console.error("Error fetching songs from Supabase:", error);
		throw error;
	}

	if (!songs || songs.length === 0) {
		console.log("No unpublished songs found in Supabase.");
		return { count: 0 };
	}

	console.log(`Found ${songs.length} unpublished songs. Publishing to Stellar...`);

	let publishedCount = 0;
	for (const song of songs) {
		try {
			await publishSong(song);
			await markSongAsPublished(song.id);
			publishedCount++;
		} catch (err) {
			console.error(`Failed to publish song ID ${song.id}:`, err);
		}
	}

	console.log(
		`Finished publishing ${publishedCount}/${songs.length} songs from Supabase to Stellar!`
	);
	return { count: publishedCount, total: songs.length };
}

export async function markSongAsPublished(songId: string) {
	const { error } = await supabase
		.from("songs")
		.update({ published: true })
		.eq("id", songId);

	if (error) {
		console.error(`Failed to mark song ${songId} as published:`, error);
	}
}
