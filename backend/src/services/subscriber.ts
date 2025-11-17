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

	const schemaEncoder = new SchemaEncoder(schemaId);
	const seen = new Set();

	const normalized = normalizeTo0x(schemaId);
	if (normalized instanceof Error) throw normalized;
	const hexSchemaId = normalized as `0x${string}`;

	const allData = await sdk.streams.getAllPublisherDataForSchema(
		hexSchemaId,
		publisherWallet
	);

	setInterval(async () => {
		const allData = await sdk.streams.getAllPublisherDataForSchema(
			schemaId,
			publisherWallet
		);
		for (const dataItem of allData) {
			let message = "",
				timestamp = "",
				sender = "";
			for (const field of dataItem) {
				const val = field.value?.value ?? field.value;
				if (field.name === "message") message = val;
				if (field.name === "timestamp") timestamp = val.toString();
				if (field.name === "sender") sender = val;
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
