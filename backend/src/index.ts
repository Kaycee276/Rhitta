import "./loadEnv.ts";
import uploadRoutes from "./routes/upload.ts";
import express from "express";
import cors from "cors";
import http from "http";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use("/", uploadRoutes);

app.get("/health", (_req: Request, res: Response) =>
	res.json({ status: "ok" })
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
