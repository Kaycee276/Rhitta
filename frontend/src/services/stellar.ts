import { rpc, scValToNative } from "@stellar/stellar-sdk";
import useSongStore from "../store/songStore";
import {
  STELLAR_CONTRACT_ID,
  STELLAR_SOROBAN_RPC_URL,
} from "../utils/stellarConfig";

let _subscribeRunning = false;
let _intervalId: number | null = null;

export async function subscribe(): Promise<(() => void) | null> {
  if (_subscribeRunning) {
    console.debug("stellar.subscribe: already running");
    return stop;
  }

  _subscribeRunning = true;
  const { upsertSong } = useSongStore.getState();

  const server = new rpc.Server(STELLAR_SOROBAN_RPC_URL);
  let lastLedger: number | undefined;

  console.debug("[Stellar] Started subscription service");

  _intervalId = window.setInterval(async () => {
    if (!STELLAR_CONTRACT_ID) return;

    try {
      const latestLedgerRes = await server.getLatestLedger();
      const startLedger =
        lastLedger || Math.max(1, latestLedgerRes.sequence - 50);

      const events = await server.getEvents({
        startLedger,
        filters: [
          {
            type: "contract",
            contractIds: [STELLAR_CONTRACT_ID],
          },
        ],
      });

      if (events?.events?.length) {
        for (const event of events.events) {
          try {
            const topicStrings = (event.topic || []).map((t) => {
              try {
                return String(scValToNative(t));
              } catch {
                return "";
              }
            });

            if (topicStrings.some((t) => t.includes("publish"))) {
              console.log("[Stellar Event] Song published:", event);
              try {
                const nativeVal = scValToNative(event.value);
                if (nativeVal && typeof nativeVal === "object") {
                  upsertSong({
                    id:
                      nativeVal.id ||
                      nativeVal.song_id ||
                      `stellar-${event.ledger}`,
                    title: nativeVal.title,
                    artist: nativeVal.artist_name || nativeVal.artist,
                    coverArt: nativeVal.cover_art,
                    audioUrl: nativeVal.audio_url,
                    genre: nativeVal.genre,
                  });
                }
              } catch {
                // Handled
              }
            } else if (topicStrings.some((t) => t.includes("play"))) {
              console.log("[Stellar Event] Song played:", event);
            }
          } catch (e) {
            console.debug("Error processing Stellar event:", e);
          }
        }
      }

      lastLedger = latestLedgerRes.sequence;
    } catch (err) {
      console.debug("[Stellar] Event query interval notice:", err);
    }
  }, 10000);

  return stop;
}

export function stop() {
  if (_intervalId !== null) {
    window.clearInterval(_intervalId);
    _intervalId = null;
  }
  _subscribeRunning = false;
  console.debug("[Stellar] Stopped subscription service");
}
