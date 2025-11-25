import "../loadEnv.ts";
import type { ReceivedSong } from "../types/types.ts";
import { publishSong } from "../services/somnia/somniaService.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads directory exists and serve it
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// multer setup
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadsDir),
	filename: (_req, file, cb) => {
		const safeName = file.originalname.replace(/[^a-zA-Z0-9.-_]/g, "-");
		cb(null, `${Date.now()}-${safeName}`);
	},
});
const upload = multer({ storage });

const receivedSongs: ReceivedSong[] = [];

// Accept either JSON body or multipart/form-data with files named 'coverArtFile' and 'audioFile'.
app.post(
	"/new-upload",
	// multer will only process multipart requests; JSON requests pass through
	upload.fields([
		{ name: "coverArtFile", maxCount: 1 },
		{ name: "audioFile", maxCount: 1 },
	]),
	(req: Request, res: Response) => {
		try {
			// payload can come from req.body (JSON or text fields in form-data)
			const payload = req.body || {};

			if (!payload || !payload.id) {
				return res.status(400).json({ error: "Missing required field 'id'" });
			}

			// files (if any) are on req.files when multipart/form-data is used
			const files = (req as any).files as
				| Record<string, Express.Multer.File[]>
				| undefined;

			const makeFileUrl = (file: Express.Multer.File) => {
				// return an absolute URL using request host
				const host = req.get("host") || "localhost";
				return `${req.protocol}://${host}/uploads/${path.basename(file.path)}`;
			};

			// determine coverArt: file takes precedence, otherwise accept provided URL string
			let coverArt: string | undefined;
			if (files && files.coverArtFile && files.coverArtFile.length) {
				coverArt = makeFileUrl(files.coverArtFile[0]);
			} else if (payload.coverArt) {
				coverArt = String(payload.coverArt);
			}

			// determine audioUrl: file takes precedence, otherwise accept provided URL string
			let audioUrl: string | undefined;
			if (files && files.audioFile && files.audioFile.length) {
				audioUrl = makeFileUrl(files.audioFile[0]);
			} else if (payload.audioUrl) {
				audioUrl = String(payload.audioUrl);
			}

			const song: ReceivedSong = {
				id: String(payload.id),
				title: payload.title ? String(payload.title) : undefined,
				artist: payload.artist ? String(payload.artist) : undefined,
				artistId: payload.artistId ? String(payload.artistId) : undefined,
				coverArt: coverArt,
				audioUrl: audioUrl,
				genre: payload.genre ? String(payload.genre) : undefined,
				receivedAt: Date.now(),
			};

			// Upsert into buffer (replace existing by id)
			const idx = receivedSongs.findIndex((s) => s.id === song.id);
			if (idx >= 0) {
				receivedSongs[idx] = { ...receivedSongs[idx], ...song };
			} else {
				receivedSongs.unshift(song);
				// cap buffer
				if (receivedSongs.length > 500) receivedSongs.pop();
			}

			// Publish to Somnia (fire-and-forget).
			publishSong(song).catch((err) => {
				console.error("Error publishing song to Somnia:", err);
			});

			// Also upsert into Supabase but store image and audio files inside songs bucket storage then store the returned loaction string in the audiourl and cover art columns but if it is already a url just use that

			// respond with success and normalized song (fields are strings when present)
			return res
				.status(200)
				.json({ ok: true, total: receivedSongs.length, song });
		} catch (err) {
			// eslint-disable-next-line no-console
			console.error("/new-upload error", err);
			return res.status(500).json({ error: "internal error" });
		}
	}
);

app.get("/events", (_req: Request, res: Response) => {
	res.json({ data: receivedSongs });
});

export default app;
