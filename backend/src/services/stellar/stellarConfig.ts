import "../../loadEnv.ts";
import { Horizon, rpc, Keypair, Networks } from "@stellar/stellar-sdk";

export const STELLAR_NETWORK = process.env.STELLAR_NETWORK || "TESTNET";
export const STELLAR_NETWORK_PASSPHRASE =
  process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;
export const STELLAR_HORIZON_URL =
  process.env.STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org";
export const STELLAR_SOROBAN_RPC_URL =
  process.env.STELLAR_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
export const STELLAR_CONTRACT_ID =
  process.env.STELLAR_CONTRACT_ID ||
  "CBQU2AB6ZEGNCMMXPPXOMGCHFXEBGU3EL7OC2PSLDTI4JKE5GT6XCPDC";

export const horizonServer = new Horizon.Server(STELLAR_HORIZON_URL);
export const rpcServer = new rpc.Server(STELLAR_SOROBAN_RPC_URL);

/**
 * Returns backend signer keypair from env or generates a fallback test keypair.
 */
export function getBackendKeypair(): Keypair {
  const secret = process.env.STELLAR_SECRET_KEY || process.env.PRIVATE_KEY;
  if (secret && secret.startsWith("S") && secret.length === 56) {
    return Keypair.fromSecret(secret);
  }

  // For local test/dev without pre-configured keys, generate a random Keypair
  console.warn(
    "⚠️ STELLAR_SECRET_KEY is not configured with a valid Stellar secret key (starts with 'S'). Generating a temporary keypair for dev.",
  );
  return Keypair.random();
}
