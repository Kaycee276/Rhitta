import "./loadEnv.ts";
import uploadRoutes from "./routes/upload.ts";
import publish from "./routes/publish.ts";
import { pushSchemaToDatabase } from "./scripts/dbPush.ts";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

const server = http.createServer(app);

app.use("/", uploadRoutes);
app.use("/", publish);

app.get("/health", (_req: Request, res: Response) =>
	res.json({ status: "ok" })
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, "0.0.0.0", () => {
	console.log(`Server listening on http://0.0.0.0:${PORT}`);
	pushSchemaToDatabase().catch((err) => {
		console.error("Database table initialization notice:", err.message);
	});
});
