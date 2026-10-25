import "../loadEnv.ts";
import {
	rpcServer,
	horizonServer,
	STELLAR_CONTRACT_ID,
} from "./stellar/stellarConfig.ts";

async function main() {
	console.log("[Stellar Subscriber] Listening for Stellar network & Soroban events...");

	let lastLedger: number | undefined;

	// Poll Soroban events if contract ID is configured, otherwise monitor Horizon transactions
	setInterval(async () => {
		try {
			if (STELLAR_CONTRACT_ID) {
				const latestLedgerRes = await rpcServer.getLatestLedger();
				const startLedger = lastLedger || latestLedgerRes.sequence - 10;

				const events = await rpcServer.getEvents({
					startLedger,
					filters: [
						{
							type: "contract",
							contractIds: [STELLAR_CONTRACT_ID],
						},
					],
				});

				if (events.events && events.events.length > 0) {
					for (const event of events.events) {
						console.log(
							`[Stellar Event] Ledger ${event.ledger} | Topic: ${event.topic.join(
								", "
							)} | Value: ${JSON.stringify(event.value)}`
						);
					}
				}
				lastLedger = latestLedgerRes.sequence;
			} else {
				// Monitor latest transactions on Testnet
				const txPage = await horizonServer
					.transactions()
					.order("desc")
					.limit(5)
					.call();

				if (txPage.records.length > 0) {
					console.log(
						`[Stellar Horizon] Latest network ledger: ${txPage.records[0].ledger_attr}`
					);
				}
			}
		} catch (err) {
			console.debug("[Stellar Subscriber] Polling notice:", (err as Error).message);
		}
	}, 5000);
}

main().catch((err) => {
	console.error("[Stellar Subscriber] Error:", err);
});
