import { publishSong } from "./somniaService.ts";
import { supabase } from "../../utils/supabase.ts";
import { getUnpublishedSongs } from "../../utils/getUnpublishedSongs.ts";

export async function publishAllSongsFromSupabase() {
	try {
		const songs = await getUnpublishedSongs();

		if (songs.length === 0) {
			console.log("No songs found in Supabase to publish");
			return;
		}

		console.log(`Publishing ${songs.length} songs from Supabase...`);

		for (const song of songs) {
			try {
				await publishSong(song);
				console.log(`Successfully published song: ${song.title || song.id}`);

				await markSongAsPublished(song.id);

				await new Promise((r) => setTimeout(r, 2000));
			} catch (err) {
				console.error(`Failed to publish song ${song.id}:`, err);
			}
		}

		console.log(
			`Finished publishing ${songs.length} songs from Supabase to Somnia!`
		);
	} catch (error) {
		console.error("Error in publishAllSongsFromSupabase:", error);
		throw error;
	}
}

export async function markSongAsPublished(songId: string) {
	try {
		const { error } = await supabase
			.from("songs")
			.update({
				published: true,
				published_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			})
			.eq("id", songId);

		if (error) {
			console.error(`Error marking song ${songId} as published:`, error);
		} else {
			console.log(`Marked song ${songId} as published in Supabase`);
		}
	} catch (error) {
		console.error(`Failed to mark song ${songId} as published:`, error);
	}
}

publishAllSongsFromSupabase();
