import "../loadEnv.ts";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const rawUrl =
  process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:dev.db";

// Use https:// for Turso cloud to ensure fast, stateless HTTP transport without WebSocket hanging
const url = rawUrl.startsWith("libsql://")
  ? rawUrl.replace(/^libsql:\/\//, "https://")
  : rawUrl;

const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

const adapter = new PrismaLibSQL({
  url,
  authToken,
});

export const prisma = new PrismaClient({ adapter });

export default prisma;
