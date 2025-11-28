import { supabase } from "./supabase.ts";

export async function getUnpublishedSongs(): Promise<any[]> {
	try {
		const { data: songs, error } = await supabase
			.from("songs")
			.select("*")
			.order("created_at", { ascending: true });

		if (error) {
			console.error("Error fetching songs from Supabase:", error);
			throw error;
		}

		console.log(`Fetched ${songs?.length || 0} songs from Supabase`);
		return songs || [];
	} catch (error) {
		console.error("Failed to fetch songs from Supabase:", error);
		return [];
	}
}
