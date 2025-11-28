import "../loadEnv.ts";
import type { ReceivedSong } from "../types/types.ts";
import { publishSong } from "../services/somnia/somniaService.ts";
import { uploadToSupabase } from "../utils/uploadFile.ts";
import { getAudioDuration } from "../utils/getAudioDuration.ts";
import { generateFileName } from "../utils/generateFileName.ts";
import { markSongAsPublished } from "../services/somnia/publishSongsFromSupabase.ts";
import { formatDate } from "../utils/formatDate.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import multer from "multer";
import { supabase } from "../utils/supabase.ts";

const app = express();
app.use(cors());
app.use(express.json());

const receivedSongs: ReceivedSong[] = [];
const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
});

app.post(
	"/new-upload",
	upload.fields([
		{ name: "audioFile", maxCount: 1 },
		{ name: "coverArtFile", maxCount: 1 },
	]),
	async (req: Request, res: Response) => {
		try {
			const files = req.files as {
				[fieldname: string]: Express.Multer.File[];
			};
			const payload = req.body || {};

			const audioFile = files?.audioFile?.[0];
			const coverArtFile = files?.coverArtFile?.[0];

			// Validate required fields
			if (!audioFile) {
				return res.status(400).json({
					success: false,
					error: "Audio file is required",
				});
			}

			if (!payload.title) {
				return res.status(400).json({
					success: false,
					error: "Title is required",
				});
			}

			const audioFileName = generateFileName(audioFile.originalname, "audio");
			const coverArtFileName = coverArtFile
				? generateFileName(coverArtFile.originalname, "cover")
				: null;

			const [audioUploadResult, coverArtUploadResult] = await Promise.all([
				uploadToSupabase(audioFile, "songs", audioFileName),
				coverArtFile
					? uploadToSupabase(coverArtFile, "covers", coverArtFileName!)
					: Promise.resolve({ path: "", url: "", error: null }),
			]);

			if (audioUploadResult.error) {
				throw new Error(
					`Audio upload failed: ${audioUploadResult.error.message}`
				);
			}
			if (coverArtUploadResult.error) {
				throw new Error(
					`Cover art upload failed: ${coverArtUploadResult.error.message}`
				);
			}

			let duration = 0;
			try {
				duration = await getAudioDuration(audioFile);
			} catch (error) {
				console.error("Error getting audio duration:", error);
			}

			const songId = payload.id || `song-${Date.now()}`;

			const songData = {
				id: songId,
				title: payload.title,
				artist: payload.artist || null,
				artist_id: payload.artistId || null,
				genre: payload.genre || null,
				cover_art: coverArtUploadResult.url || null,
				audio_url: audioUploadResult.url,
				duration: duration,
				price: payload.price || 0,
				release_date: payload.releaseDate || null,
				metadata: payload.metadata || {},
				received_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			const { data: insertedSong, error } = await supabase
				.from("songs")
				.insert([songData])
				.select()
				.single();

			if (insertedSong) {
				await publishSong(insertedSong);
				await markSongAsPublished(insertedSong.id);
			}
			if (error) {
				console.error("Supabase insert error:", error);
				throw new Error(`Database insert failed: ${error.message}`);
			}

			const receivedSong: ReceivedSong = {
				id: songId,
				title: payload.title,
				artist: payload.artist,
				artistId: payload.artistId,
				duration,
				audioUrl: audioUploadResult.url,
				coverArt: coverArtUploadResult.url,
				genre: payload.genre,
				receivedAt: formatDate(new Date().toISOString()),
			};
			receivedSongs.push(receivedSong);

			console.log("Song successfully stored:", insertedSong);

			res.status(200).json({
				success: true,
				ok: true,
				message: "Song uploaded, stored and published successfully",
				data: insertedSong,
				song: insertedSong,
				total: 1,
			});
		} catch (error) {
			console.error("Error in /new-upload:", error);
			res.status(500).json({
				success: false,
				ok: false,
				error: error instanceof Error ? error.message : "Upload failed",
				total: 0,
			});
		}
	}
);

app.get("/events", (_req: Request, res: Response) => {
	res.json({ data: receivedSongs });
});

export default app;
