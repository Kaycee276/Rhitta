import "../loadEnv.ts";
import { createClient } from "@libsql/client";

export async function pushSchemaToDatabase() {
  const rawUrl =
    process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:dev.db";

  // Convert libsql:// to https:// for stateless HTTP transport (avoids hanging WebSocket handshakes in cloud containers)
  const url = rawUrl.startsWith("libsql://")
    ? rawUrl.replace(/^libsql:\/\//, "https://")
    : rawUrl;

  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  console.log(`[Database Init] Connecting to: ${url}`);
  const client = createClient({ url, authToken });

  const createSongsTable = `
		CREATE TABLE IF NOT EXISTS "songs" (
			"id" TEXT NOT NULL PRIMARY KEY,
			"title" TEXT NOT NULL,
			"artist" TEXT,
			"artist_id" TEXT,
			"genre" TEXT,
			"cover_art" TEXT,
			"audio_url" TEXT NOT NULL,
			"duration" REAL NOT NULL DEFAULT 0,
			"price" REAL NOT NULL DEFAULT 0,
			"release_date" TEXT,
			"metadata" TEXT,
			"published" BOOLEAN NOT NULL DEFAULT 0,
			"received_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			"updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
	`;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Database init timed out after 8s")),
      8000,
    ),
  );

  await Promise.race([client.execute(createSongsTable), timeoutPromise]);
  console.log(
    "✅ Successfully initialized and verified 'songs' table in database!",
  );
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith("dbPush.ts")) {
  pushSchemaToDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Failed to initialize database tables:", err);
      process.exit(1);
    });
}
