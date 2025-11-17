import "../loadEnv.ts";
import { normalizeTo0x } from "../utils/hex.ts";
import { dreamChain } from "./dream-chain.ts";
import formatSchemaId from "../utils/formatSchemaId.ts";
import { SDK, SchemaEncoder, zeroBytes32 } from "@somnia-chain/streams";
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

async function main() {
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

	const helloSchema = `string message,uint256 timestamp,address sender`;

	const schemaIdRaw = await sdk.streams.computeSchemaId(helloSchema);

	if (!schemaIdRaw) {
		// handle the unexpected null case explicitly
		throw new Error("computeSchemaId returned null");
	}
	const schemaId = schemaIdRaw as `0x${string}`;
	console.log("Schema ID:", schemaId);

	// const ignoreAlreadyRegistered = true;

	try {
		const txHash = await sdk.streams.registerDataSchemas(
			[
				{
					id: "Hello World!",
					schema: helloSchema,
					parentSchemaId: normalizeTo0x(zeroBytes32),
				},
			]
			// ignoreAlreadyRegistered
		);

		if (txHash instanceof Error) {
			throw txHash;
		}

		if (typeof txHash === "string" && txHash.length > 0) {
			const hashHex = normalizeTo0x(txHash);
			await waitForTransactionReceipt(publicClient, { hash: hashHex });
			console.log("Schema registered or confirmed, Tx:", txHash);
		} else {
			console.log("Schema already registered, no Tx needed.");
		}
	} catch (err) {
		if (String(err).includes("SchemaAlreadyRegistered")) {
			console.log(" Schema already registered. Continuing...");
		} else {
			throw err;
		}
	}

	const encoder = new SchemaEncoder(helloSchema);
	let count = 0;

	setInterval(async () => {
		count++;
		const data = encoder.encodeData([
			{ name: "message", value: `Hello World #${count}!!!`, type: "string" },
			{
				name: "timestamp",
				value: BigInt(Math.floor(Date.now())),
				type: "uint256",
			},
			{ name: "sender", value: walletClient.account.address, type: "address" },
		]);

		const dataStreams = [
			{ id: toHex(`hello-${count}`, { size: 32 }), schemaId, data },
		];

		const tx = await sdk.streams.set(dataStreams);
		console.log(`✅ Published: Hello World #${count} (Tx: ${tx})`);
	}, 3000);
}

main();
