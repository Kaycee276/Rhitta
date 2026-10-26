import "./loadEnv.ts";
import uploadRoutes from "./routes/upload.ts";
import publish from "./routes/publish.ts";
import { pushSchemaToDatabase } from "./scripts/dbPush.ts";
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import type { Request, Response } from "express";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : ["*"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server) or wildcard
    if (
      !origin ||
      allowedOrigins.includes("*") ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

const server = http.createServer(app);

app.use("/", uploadRoutes);
app.use("/", publish);

app.get("/health", (_req: Request, res: Response) =>
  res.json({ status: "ok" }),
);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  if (process.env.ALLOWED_ORIGINS) {
    console.log(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`);
  } else {
    console.log(
      "[CORS] ALLOWED_ORIGINS not set. Defaulting to allow all origins (*).",
    );
  }
  pushSchemaToDatabase().catch((err) => {
    console.error("Database table initialization notice:", err.message);
  });
});
