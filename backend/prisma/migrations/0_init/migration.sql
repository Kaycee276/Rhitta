-- CreateTable
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
