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
	"uint256 id,string title,string artist,string artistId,string coverArt,string audioUrl,string genre";

// cache initialized SDK and encoder
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
		if (String(err).includes("SchemaAlreadyRegistered")) {
			console.log("Schema already registered — continuing.");
		} else {
			// log and continue; do not fail entirely
			console.warn("registerDataSchemas error:", err);
		}
	}

	const encoder = new SchemaEncoder(songSchema);

	cached = { sdk, encoder, schemaId };
	return cached;
}

/**
 * Publish a single song object to Somnia Data Streams.
 * Accepts a song where id may be non-numeric; numeric id is required by the schema so
 * we fall back to Date.now() when id is not numeric.
 */
export async function publishSong(song: {
	id: string;
	title?: string;
	artist?: string;
	artistId?: string;
	coverArt?: string;
	audioUrl?: string;
	genre?: string;
}) {
	const { sdk, encoder, schemaId } = await ensureInitialized();
	if (!sdk || !encoder || !schemaId)
		throw new Error("Somnia SDK not initialized");

	// schema expects uint256 id — try to use numeric id, otherwise use timestamp
	let numericId: bigint;
	if (/^\d+$/.test(song.id)) numericId = BigInt(song.id);
	else numericId = BigInt(Date.now());

	const encodedData = encoder.encodeData([
		{ name: "id", value: numericId, type: "uint256" },
		{ name: "title", value: song.title ?? "", type: "string" },
		{ name: "artist", value: song.artist ?? "", type: "string" },
		{ name: "artistId", value: song.artistId ?? "", type: "string" },
		{ name: "coverArt", value: song.coverArt ?? "", type: "string" },
		{ name: "audioUrl", value: song.audioUrl ?? "", type: "string" },
		{ name: "genre", value: song.genre ?? "", type: "string" },
	]);

	const streamId = toHex(`song-${song.id}`, { size: 32 });

	try {
		const tx = await sdk.streams.set([
			{
				id: streamId,
				schemaId,
				data: encodedData,
			},
		]);
		console.log(
			`Published song ${song.title ?? song.id} to Somnia (tx: ${tx})`
		);
		return tx;
	} catch (err) {
		console.error("publishSong error:", err);
		throw err;
	}
}

export async function publishMockSongs() {
	for (const song of mockSongs) {
		try {
			await publishSong(song as any);
			// small delay to avoid spamming
			await new Promise((r) => setTimeout(r, 1500));
		} catch (err) {
			console.warn("publishMockSongs item error:", err);
		}
	}
	console.log("All mock songs published via SDS!");
}
