import { dreamChain } from "../utils/dreamChain";
import formatSchemaId from "../utils/formatSchemaId";
import useSongStore from "../store/songStore";
import { normalizeTo0x } from "../utils/hex";
import { createPublicClient, http } from "viem";

// Module-level state to track a running subscription. Using module-level
// variables (instead of attaching properties to the function) is more
// robust across HMR and function reassignments.
let _subscribeRunning = false;
let _subscribeStop: (() => void) | null = null;

const originalWarn = console.warn;
console.warn = (...args) => {
	if (
		args.length > 0 &&
		typeof args[0] === "string" &&
		args[0].includes("Unable to compute final schema")
	) {
		return;
	}
	originalWarn(...args);
};

type Song = {
	id: string;
	title: string;
	artist: string;
	artistId: string;
	coverArt: string;
	audioUrl: string;
	genre: string;
	duration: bigint;
};

export async function subscribe() {
	const { upsertSong } = useSongStore.getState();

	// If already running, return the existing stop function.
	if (_subscribeRunning) {
		console.debug("somnia.subscribe: already running, returning existing stop");
		return _subscribeStop;
	}
	const publisherWallet = import.meta.env.VITE_PUBLISHER_WALLET;
	if (!publisherWallet)
		throw new Error("PUBLISHER_WALLET env variable is required");

	const publicClient = createPublicClient({
		chain: dreamChain,
		transport: http(),
	});

	const somnia = await import("@somnia-chain/streams");
	const { SDK, SchemaEncoder } =
		somnia as typeof import("@somnia-chain/streams");

	const sdk = new SDK({ public: publicClient });

	const songSchema =
		"uint256 id,string title,string artist,string artistId,string coverArt,string audioUrl,string genre,uint256 duration";

	const schemaIdRaw = await sdk.streams.computeSchemaId(songSchema);
	const schemaId = normalizeTo0x(formatSchemaId(schemaIdRaw));

	const publisher = normalizeTo0x(publisherWallet);
	const encoder = new SchemaEncoder(songSchema);
	const seen = new Set();

	const intervalId = window.setInterval(async () => {
		const allData = await sdk.streams.getAllPublisherDataForSchema(
			schemaId,
			publisher
		);
		if (!allData?.length) return;

		for (const item of allData) {
			if (typeof item === "string" && item.startsWith("0x")) {
				const decoded = encoder.decodeData(item);

				const song: Song = {
					id: "",
					title: "",
					artist: "",
					artistId: "",
					coverArt: "",
					audioUrl: "",
					genre: "",
					duration: BigInt(0),
				};

				decoded.forEach((entry) => {
					switch (entry.name) {
						case "id":
							song.id = String(entry.value.value ?? entry.value);
							break;
						case "title":
							song.title = String(entry.value.value ?? entry.value);
							break;
						case "artist":
							song.artist = String(entry.value.value ?? entry.value);
							break;
						case "artistId":
							song.artistId = String(entry.value.value ?? entry.value);
							break;
						case "coverArt":
							song.coverArt = String(entry.value.value ?? entry.value);
							break;
						case "audioUrl":
							song.audioUrl = String(entry.value.value ?? entry.value);
							break;
						case "genre":
							song.genre = String(entry.value.value ?? entry.value);
							break;
						case "duration": {
							const val = entry.value.value ?? entry.value;
							if (typeof val === "bigint") {
								song.duration = val;
							} else if (typeof val === "number" || typeof val === "string") {
								song.duration = BigInt(val);
							} else {
								console.warn("Unexpected duration value:", val);
								song.duration = BigInt(0);
							}
							break;
						}
					}
				});

				const uniqueId = `${song.id}-${song.title}`;
				if (seen.has(uniqueId)) continue;
				seen.add(uniqueId);

				upsertSong({
					id: song.id,
					title: song.title,
					artist: song.artist,
					artistId: song.artistId,
					coverArt: song.coverArt,
					audioUrl: song.audioUrl,
					genre: song.genre,
					duration: Number(song.duration),
				});
				continue;
			}

			console.warn("Unexpected non-hex item:", item);
		}
	}, 5000);

	const stop = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		_subscribeRunning = false;
		_subscribeStop = null;
		console.debug("somnia.subscribe: stopped");
	};

	_subscribeRunning = true;
	_subscribeStop = stop;
	console.debug("somnia.subscribe: started interval", { intervalId });
	return stop;
}

export function stopSubscribe() {
	if (typeof _subscribeStop === "function") {
		_subscribeStop();
	}
}
