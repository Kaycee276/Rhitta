import { publishAllSongsFromDatabase } from "../services/stellar/publishSongsFromDatabase.ts";
import express from "express";
import type { Request, Response } from "express";

const router = express.Router();

router.post("/publish-songs", async (_req: Request, res: Response) => {
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

export default router;
