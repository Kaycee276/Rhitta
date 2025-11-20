import "../../loadEnv.ts";
import type { Song } from "../../types/types.ts";
import { dreamChain } from "../dream-chain.ts";
import { mockSongs } from "../../data/soundData.ts";
import { normalizeTo0x } from "../../utils/hex.ts";
import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { createPublicClient, createWalletClient, http, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { waitForTransactionReceipt } from "viem/actions";

const walletKey = process.env.PRIVATE_KEY;
if (!walletKey) {
	throw new Error("PRIVATE_KEY is not set in ENV");
}
const normalizedKey = walletKey.startsWith("0x")
	? (walletKey as `0x${string}`)
	: (`0x${walletKey}` as `0x${string}`);

async function publishSong(song: Song) {
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

	const songSchema = `uint256 id,string title,string artist,string artistId,string coverArt,string audioUrl,string genre`;

	const schemaIdRaw = await sdk.streams.computeSchemaId(songSchema);

	if (!schemaIdRaw) {
		throw new Error("computeSchemaId returned null");
	}
	const schemaId = schemaIdRaw as `0x${string}`;
	console.log("Schema ID:", schemaId);

	// const schemaEncoder = new SchemaEncoder(songSchema);

	try {
		const txHash = await sdk.streams.registerDataSchemas([
			{
				id: `Song Schema for ${song.title}`,
				schema: songSchema,
				parentSchemaId: normalizeTo0x(
					"0x0000000000000000000000000000000000000000000000000000000000000000"
				),
			},
		]);

		if (txHash instanceof Error) {
			throw txHash;
		}

		if (typeof txHash === "string" && txHash.length > 0) {
			const hashHex = normalizeTo0x(txHash);
			await waitForTransactionReceipt(walletClient, { hash: hashHex });
			console.log("Schema registered in tx:", hashHex);
		} else {
			console.log("Schema registration tx:", txHash);
		}
	} catch (err) {
		if (String(err).includes("SchemaAlreadyRegistered")) {
			console.log("Schema already registered, proceeding to publish data.");
		} else {
			throw err;
		}
	}

	const encoder = new SchemaEncoder(songSchema);

	const data = encoder.encodeData([
		{ name: "id", value: BigInt(song.id), type: "uint256" },
		{ name: "title", value: song.title, type: "string" },
		{ name: "artist", value: song.artist, type: "string" },
		{ name: "artistId", value: song.artistId, type: "string" },
		{ name: "coverArt", value: song.coverArt || "", type: "string" },
		{ name: "audioUrl", value: song.audioUrl, type: "string" },
		{ name: "genre", value: song.genre, type: "string" },
	]);

	const dataStreams = [
		{ id: toHex(`song-${song.id}`, { size: 32 }), schemaId, data },
	];

	const tx = await sdk.streams.set(dataStreams);
	console.log(`Published song: ${song.title} by ${song.artist} (Tx: ${tx})`);
}

async function main() {
	const songs = mockSongs;
	for (const song of songs) {
		await publishSong(song);
		console.log(`Song pushed via SDS, Song title: ${song.title}`);
	}
}

main();
