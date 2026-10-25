import "../loadEnv.ts";
import {
	horizonServer,
	rpcServer,
	getBackendKeypair,
	STELLAR_NETWORK_PASSPHRASE,
	STELLAR_CONTRACT_ID,
} from "./stellar/stellarConfig.ts";
import { publishSong } from "./stellar/stellarService.ts";

async function main() {
	const keypair = getBackendKeypair();
	console.log(`[Stellar Publisher] Starting with key: ${keypair.publicKey()}`);

	let count = 0;
	setInterval(async () => {
		count++;
		try {
			await publishSong({
				id: `stellar-track-${count}`,
				title: `Stellar Groove #${count}`,
				artist: "Rhitta Artist",
				artist_id: keypair.publicKey(),
				genre: "Electronic",
				duration: 180,
				price: 0.5,
			});
			console.log(`[Stellar Publisher] Published track #${count}`);
		} catch (err) {
			console.error("[Stellar Publisher] Publish error:", err);
		}
	}, 5000);
}

main().catch((err) => {
	console.error("[Stellar Publisher] Fatal error:", err);
});
