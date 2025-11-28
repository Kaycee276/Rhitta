import "../../loadEnv.ts";
import { dreamChain } from "../dream-chain.ts";
import { mockSongs } from "../../data/soundData.ts";
import { normalizeTo0x } from "../../utils/hex.ts";
import { SDK, SchemaEncoder, zeroBytes32 } from "@somnia-chain/streams";
import { createPublicClient, createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { waitForTransactionReceipt } from "viem/actions";

const walletKey = process.env.PRIVATE_KEY;
if (!walletKey) throw new Error("PRIVATE_KEY is not set in ENV");

const normalizedKey = walletKey.startsWith("0x")
	? (walletKey as `0x${string}`)
	: (`0x${walletKey}` as `0x${string}`);

const songSchema =
	"uint256 id,string title,string artist,string artistId,string coverArt,string audioUrl,string genre,uint256 duration";

let cached: {
	sdk?: SDK;
	encoder?: SchemaEncoder;
	schemaId?: `0x${string}`;
} = {};

async function ensureInitialized() {
	if (cached.sdk && cached.encoder && cached.schemaId) return cached;

	const publicClient = createPublicClient({
		chain: dreamChain,
		transport: http(),
	});

	const walletClient = createWalletClient({
		account: privateKeyToAccount(normalizedKey),
		chain: dreamChain,
		transport: http(),
	});

	const sdk = new SDK({
		public: publicClient,
		wallet: walletClient,
	});

	const schemaIdRaw = await sdk.streams.computeSchemaId(songSchema);
	if (!schemaIdRaw) throw new Error("computeSchemaId returned null");
	const schemaId = schemaIdRaw as `0x${string}`;

	console.log("SchemaId :", schemaId);

	// try register (ignore if already registered)
	try {
		const txHash = await sdk.streams.registerDataSchemas([
			{
				id: "Song Schema",
				schema: songSchema,
				parentSchemaId: normalizeTo0x(zeroBytes32),
			},
		]);

		if (typeof txHash === "string" && txHash.length > 0) {
			const hashHex = normalizeTo0x(txHash);
			await waitForTransactionReceipt(walletClient, { hash: hashHex });
			console.log("Schema registered:", hashHex);
		}
	} catch (err) {
		const errorStr = String(err);
		if (
			errorStr.includes("SchemaAlreadyRegistered") ||
			errorStr.includes("IDAlreadyUsed") ||
			errorStr.includes("IDAlreadyUsed()")
		) {
			console.log("Schema already registered — continuing.");
		} else {
			console.warn("registerDataSchemas error:", err);
		}
	}

	const encoder = new SchemaEncoder(songSchema);

	cached = { sdk, encoder, schemaId };
	return cached;
}

/**
 * Publish a single song object to Somnia Data Streams.
 * Accepts a song from Supabase database format
 */
export async function publishSong(song: {
	id: string;
	title?: string;
	artist?: string;
	artist_id?: string;
	cover_art?: string;
	audio_url?: string;
	genre?: string;
	duration?: number;
}) {
	const { sdk, encoder, schemaId } = await ensureInitialized();
	if (!sdk || !encoder || !schemaId)
		throw new Error("Somnia SDK not initialized");

	const mappedSong = {
		id: song.id,
		title: song.title ?? "",
		artist: song.artist ?? "",
		artistId: song.artist_id ?? "",
		coverArt: song.cover_art ?? "",
		audioUrl: song.audio_url ?? "",
		genre: song.genre ?? "",
		duration: song.duration ?? 0,
	};

	let numericId: bigint;
	if (/^\d+$/.test(mappedSong.id)) numericId = BigInt(mappedSong.id);
	else numericId = BigInt(Date.now());

	const encodedData = encoder.encodeData([
		{ name: "id", value: numericId, type: "uint256" },
		{ name: "title", value: mappedSong.title, type: "string" },
		{ name: "artist", value: mappedSong.artist, type: "string" },
		{ name: "artistId", value: mappedSong.artistId, type: "string" },
		{ name: "coverArt", value: mappedSong.coverArt, type: "string" },
		{ name: "audioUrl", value: mappedSong.audioUrl, type: "string" },
		{ name: "genre", value: mappedSong.genre, type: "string" },
		{
			name: "duration",
			value: BigInt(Math.floor(mappedSong.duration)),
			type: "uint256",
		},
	]);

	const streamId = `song-${song.id}`;

	let streamIdBytes32: `0x${string}`;
	if (streamId.length <= 32) {
		streamIdBytes32 = toHex(streamId.padEnd(32, "\0"), { size: 32 });
	} else {
		const hash = toHex(streamId).slice(0, 66);
		streamIdBytes32 = hash as `0x${string}`;
	}

	try {
		const tx = await sdk.streams.set([
			{
				id: streamIdBytes32,
				schemaId,
				data: encodedData,
			},
		]);
		console.log(
			`Published song ${
				mappedSong.title || mappedSong.id
			} to Somnia (tx: ${tx})`
		);
		return tx;
	} catch (err) {
		const errorStr = String(err);
		if (
			errorStr.includes("SchemaAlreadyRegistered") ||
			errorStr.includes("IDAlreadyUsed") ||
			errorStr.includes("IDAlreadyUsed()")
		) {
			console.log("⚠️ Schema/ID already registered. Continuing...");
			return null;
		} else if (errorStr.includes("AbiEncodingBytesSizeMismatchError")) {
			console.error("❌ Bytes size mismatch - check stream ID formatting");
			throw new Error(`Stream ID formatting error: ${errorStr}`);
		} else {
			console.error("❌ Failed to publish song:", err);
			throw err;
		}
	}
}

export async function publishMockSongs() {
	let successCount = 0;
	let errorCount = 0;

	for (const song of mockSongs) {
		try {
			const result = await publishSong(song as any);
			if (result) {
				successCount++;
				console.log(
					`✅ Successfully published song ${successCount}/${mockSongs.length}`
				);
			} else {
				console.log(`⏭️  Skipped already published song`);
			}
			await new Promise((r) => setTimeout(r, 2000));
		} catch (err) {
			errorCount++;
			console.warn(`❌ Failed to publish song ${song.id}:`, err);
		}
	}
	console.log(
		`Publishing complete: ${successCount} successful, ${errorCount} failed`
	);
}
