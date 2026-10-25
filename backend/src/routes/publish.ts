import { publishAllSongsFromDatabase } from "../services/stellar/publishSongsFromDatabase.ts";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/publish-songs", async (_req: Request, res: Response) => {
	try {
		const result = await publishAllSongsFromDatabase();
		res.json({
			success: true,
			message: "Started publishing songs to Stellar",
			data: result,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: "Failed to publish songs to Stellar",
		});
	}
});

export default app;
