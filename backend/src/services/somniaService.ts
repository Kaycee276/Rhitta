import { EventEmitter } from "events";
import { StreamEvent, Song } from "../types/types";
import dotenv from "dotenv";
dotenv.config();
import { SDK } from "@somnia-chain/streams";
import { createPublicClient, createWalletClient, http } from "viem";
import { somniaTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const rpcUrl = process.env.SOMNIA_RPC_URL;
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const sdk = new SDK({
	public: createPublicClient({
		chain: somniaTestnet,
		transport: http(rpcUrl!),
	}),
	wallet: createWalletClient({
		chain: somniaTestnet,
		transport: http(rpcUrl!),
		account,
	}),
});

class SomniaService extends EventEmitter {
	private bufferedEvents: StreamEvent[] = [];
	private maxBufferSize = 100;

	constructor() {
		super();
		this.init();
	}

	private async init() {
		// Subscribe to Somnia stream events
		sdk.streams.events.subscribe((event: StreamEvent) => {
			this.bufferedEvents.push(event);
			if (this.bufferedEvents.length > this.maxBufferSize) {
				this.bufferedEvents.shift();
			}
			this.emit("event", event);
		});
	}

	public getBufferedEvents(): StreamEvent[] {
		return this.bufferedEvents;
	}
}

export const somniaService = new SomniaService();
