import { publishAllSongsFromSupabase } from "../services/somnia/publishSongsFromSupabase.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/publish-songs", async (_req: Request, res: Response) => {
	try {
		await publishAllSongsFromSupabase();
		res.json({
			success: true,
			message: "Started publishing all songs to Somnia",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to publish songs",
		});
	}
});

export default app;
