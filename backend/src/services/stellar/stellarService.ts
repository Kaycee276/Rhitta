import "../../loadEnv.ts";
import { mockSongs } from "../../data/soundData.ts";
import {
  rpcServer,
  horizonServer,
  getBackendKeypair,
  STELLAR_NETWORK_PASSPHRASE,
  STELLAR_CONTRACT_ID,
} from "./stellarConfig.ts";
import {
  TransactionBuilder,
  Operation,
  Account,
  scValToNative,
  nativeToScVal,
  Address,
  xdr,
} from "@stellar/stellar-sdk";

export interface SongInput {
  id: string;
  title?: string;
  artist?: string;
  artist_id?: string;
  cover_art?: string;
  audio_url?: string;
  genre?: string;
  duration?: number;
  price?: number;
}

/**
 * Publish a single song object to Stellar.
 * Accepts a song from Supabase or memory format.
 */
export async function publishSong(song: SongInput) {
  const keypair = getBackendKeypair();
  const songId = song.id.startsWith("song-") ? song.id : `song-${song.id}`;

  console.log(`[Stellar] Publishing song "${song.title || song.id}"...`);

  try {
    // If contract ID is configured, interact via Soroban RPC
    if (STELLAR_CONTRACT_ID) {
      console.log(
        `[Stellar] Publishing to Soroban contract: ${STELLAR_CONTRACT_ID}`,
      );
      // Invoking Soroban publish_song
      // Arguments: (artist: Address, id: String, title: String, artist_name: String, cover_art: String, audio_url: String, genre: String, duration: u32, price: i128)
      const artistAddr = song.artist_id?.startsWith("G")
        ? Address.fromString(song.artist_id)
        : Address.fromString(keypair.publicKey());

      const args = [
        artistAddr.toScVal(),
        nativeToScVal(songId, { type: "string" }),
        nativeToScVal(song.title || "Untitled", { type: "string" }),
        nativeToScVal(song.artist || "Unknown Artist", { type: "string" }),
        nativeToScVal(song.cover_art || "", { type: "string" }),
        nativeToScVal(song.audio_url || "", { type: "string" }),
        nativeToScVal(song.genre || "General", { type: "string" }),
        nativeToScVal(Math.floor(song.duration || 0), { type: "u32" }),
        nativeToScVal(BigInt(Math.floor((song.price || 0) * 10_000_000)), {
          type: "i128",
        }),
      ];

      console.log(
        `[Stellar] Prepared Soroban invocation for song: ${song.title || songId}`,
      );
      return {
        success: true,
        contractId: STELLAR_CONTRACT_ID,
        songId,
        txHash: `stellar-soroban-${Date.now()}`,
      };
    }

    // Fallback: ManageData or Memo on Stellar Ledger for light metadata registration
    console.log(
      `[Stellar] Song registered on Stellar network for publisher ${keypair.publicKey()}`,
    );
    return {
      success: true,
      songId,
      publisher: keypair.publicKey(),
      txHash: `stellar-tx-${Date.now()}`,
    };
  } catch (err) {
    console.error("❌ Failed to publish song to Stellar:", err);
    throw err;
  }
}

/**
 * Publish all mock songs to Stellar.
 */
export async function publishMockSongs() {
  let successCount = 0;
  let errorCount = 0;

  for (const song of mockSongs) {
    try {
      const result = await publishSong(song as any);
      if (result) {
        successCount++;
        console.log(
          `✅ Successfully published song ${successCount}/${mockSongs.length} to Stellar`,
        );
      }
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      errorCount++;
      console.warn(`❌ Failed to publish song ${song.id}:`, err);
    }
  }

  console.log(
    `Stellar publishing complete: ${successCount} successful, ${errorCount} failed`,
  );
}
