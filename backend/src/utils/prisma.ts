import "../loadEnv.ts";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const url =
	process.env.TURSO_DATABASE_URL ||
	process.env.DATABASE_URL ||
	"file:dev.db";

const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

const adapter = new PrismaLibSQL({
	url,
	authToken,
});

export const prisma = new PrismaClient({ adapter });

export default prisma;
