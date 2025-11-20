import "./loadEnv.ts";
import { somniaService } from "./services/somnia/somniaService.ts";
import express from "express";
import cors from "cors";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import type { Request, Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast incoming somnia events to all connected websocket clients
// listen for events from service and broadcast
(somniaService as any).on("event", (e: any) => {
	const payload = JSON.stringify({ type: "event", data: e });
	wss.clients.forEach((client) => {
		if ((client as WebSocket).readyState === WebSocket.OPEN)
			(client as WebSocket).send(payload);
	});
});

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
	// on connect, send recent buffer
	const buffer = somniaService.getBuffer("Hello World!");
	ws.send(JSON.stringify({ type: "buffer", data: buffer }));

	ws.on("message", (msg: WebSocket.RawData) => {
		// optional: handle client messages (subscribe/unsubscribe commands)
		// keep minimal for now
		try {
			const parsed = JSON.parse(msg.toString());
			if (parsed?.action === "ping") ws.send(JSON.stringify({ type: "pong" }));
		} catch (e) {
			// ignore
		}
	});
});

app.get("/health", (_req: Request, res: Response) =>
	res.json({ status: "ok" })
);

app.get("/events", (_req: Request, res: Response) => {
	res.json(somniaService.getBuffer("Hello World!"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on http://localhost:${PORT}`);
});
