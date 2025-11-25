import { dreamChain } from "../utils/dreamChain";
import formatSchemaId from "../utils/formatSchemaId";
import { normalizeTo0x } from "../utils/hex";
import { upsertMockSong } from "../data/mockData";
import { useSongStore } from "../store/songStore";
import { createPublicClient, http } from "viem";
import { SDK } from "@somnia-chain/streams";

export async function subscribe() {
	const publisherWallet = import.meta.env.VITE_PUBLISHER_WALLET;
	if (!publisherWallet) {
		throw new Error("PUBLISHER_ WALLET env variable is required");
	}
	const publicClient = createPublicClient({
		chain: dreamChain,
		transport: http(),
	});
	const sdk = new SDK({ public: publicClient });

	const songSchema =
		"uint256 id,string title,string artist,string artistId,string coverArt,string audioUrl,string genre";

	const schemaIdRaw = await sdk.streams.computeSchemaId(songSchema);
	if (!schemaIdRaw) throw new Error("computeSchemaId returned null");
	const schemaId = formatSchemaId(schemaIdRaw);

	const seen = new Set();

	const hexSchemaId = normalizeTo0x(schemaId);
	const normalizePubKey = normalizeTo0x(publisherWallet);

	setInterval(async () => {
		const allData = await sdk.streams.getAllPublisherDataForSchema(
			hexSchemaId,
			normalizePubKey
		);
		if (!allData || allData.length === 0) return;
		for (const dataItem of allData) {
			let id = "",
				title = "",
				artist = "",
				artistId = "",
				coverArt = "",
				audioUrl = "",
				genre = "";
			for (const field of dataItem) {
				if (typeof field === "string") {
					continue;
				}

				const val = field.value?.value ?? field.value;
				const strVal =
					val === undefined || val === null
						? ""
						: typeof val === "string"
						? val
						: typeof val === "object"
						? JSON.stringify(val)
						: String(val);
				if (field.name === "id") id = strVal;
				if (field.name === "title") title = strVal;
				if (field.name === "artist") artist = strVal;
				if (field.name === "artistId") artistId = strVal;
				if (field.name === "coverArt") coverArt = strVal;
				if (field.name === "audioUrl") audioUrl = strVal;
				if (field.name === "genre") genre = strVal;
			}

			const uniqueId = `${id}-${title}`;
			if (seen.has(uniqueId)) continue;
			seen.add(uniqueId);

			console.log("New Song Data:");
			console.log({ id, title, artist, artistId, coverArt, audioUrl, genre });
			const partial = {
				id,
				title,
				artist,
				artistId,
				coverArt,
				audioUrl,
				genre,
			};
			upsertMockSong(partial);
			useSongStore.getState().upsertSong(partial);
		}
	}, 15000);
}
