import { defineChain } from "viem";

export const dreamChain = defineChain({
	id: 50312,
	name: "SomniaDream",
	network: "somnia-dream",
	nativeCurrency: {
		name: "STT",
		symbol: "STT",
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ["https://dream-rpc.somnia.network"],
		},
	},
});
