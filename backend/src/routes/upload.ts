import "../loadEnv.ts";
import type { ReceivedSong } from "../types/types.ts";
import { publishSong } from "../services/stellar/stellarService.ts";
import { uploadToSupabase } from "../utils/uploadFile.ts";
import { getAudioDuration } from "../utils/getAudioDuration.ts";
import { generateFileName } from "../utils/generateFileName.ts";
import { markSongAsPublished } from "../services/stellar/publishSongsFromSupabase.ts";
import { formatDate } from "../utils/formatDate.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import multer from "multer";
import prisma from "../utils/prisma.ts";

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

			const insertedSong = await prisma.song.create({
				data: {
					id: songId,
					title: payload.title,
					artist: payload.artist || null,
					artistId: payload.artistId || null,
					genre: payload.genre || null,
					coverArt: coverArtUploadResult.url || null,
					audioUrl: audioUploadResult.url,
					duration,
					price: Number(payload.price) || 0,
					releaseDate: payload.releaseDate || null,
					metadata:
						typeof payload.metadata === "object"
							? JSON.stringify(payload.metadata)
							: payload.metadata || null,
				},
			});

			if (insertedSong) {
				await publishSong({
					id: insertedSong.id,
					title: insertedSong.title,
					artist: insertedSong.artist || undefined,
					artist_id: insertedSong.artistId || undefined,
					cover_art: insertedSong.coverArt || undefined,
					audio_url: insertedSong.audioUrl,
					genre: insertedSong.genre || undefined,
					duration: insertedSong.duration,
					price: insertedSong.price,
				});
				await markSongAsPublished(insertedSong.id);
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
