import "../loadEnv.ts";
import formatSchemaId from "../utils/formatSchemaId.ts";
import { normalizeTo0x } from "../utils/hex.ts";
import { dreamChain } from "./dream-chain.ts";
import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { createPublicClient, http } from "viem";

async function main() {
	const publisherWallet = process.env.PUBLISHER_WALLET;
	if (!publisherWallet) {
		throw new Error("PUBLISHER_ WALLET env variable is required");
	}
	const publicClient = createPublicClient({
		chain: dreamChain,
		transport: http(),
	});
	const sdk = new SDK({ public: publicClient });

	const helloSchema = `string message,uint256 timestamp,address sender`;
	const schemaIdRaw = await sdk.streams.computeSchemaId(helloSchema);
	if (!schemaIdRaw) throw new Error("computeSchemaId returned null");

	const schemaId = formatSchemaId(schemaIdRaw);
	if (!schemaId) throw new Error("formatSchemaId returned undefined");
	console.log("Computed Schema ID:", schemaId);

	// const schemaEncoder = new SchemaEncoder(helloSchema);
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
			let message = "",
				timestamp = "",
				sender = "";
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
				if (field.name === "message") message = strVal;
				if (field.name === "timestamp") timestamp = strVal;
				if (field.name === "sender") sender = strVal;
			}

			const id = `${timestamp}-${message}`;
			if (!seen.has(id)) {
				seen.add(id);
				console.log(
					`🆕 ${message} from ${sender} at ${new Date(
						Number(timestamp) * 1000
					).toLocaleTimeString()}`
				);
			}
		}
	}, 3000);
}

main();
