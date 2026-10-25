/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as freighter from "@stellar/freighter-api";
import { addNotification } from "../utils/notifications";

export interface StellarWalletContextType {
  address: string | null;
  shortAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  hasFreighter: boolean;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const StellarWalletContext = createContext<StellarWalletContextType>({
  address: null,
  shortAddress: null,
  isConnected: false,
  isConnecting: false,
  hasFreighter: false,
  network: null,
  connect: async () => {},
  disconnect: () => {},
});

export const StellarWalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasFreighter, setHasFreighter] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);

  // Check if Freighter extension is available
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await freighter.isConnected();
        const isInstalled =
          typeof connected === "object" && connected !== null
            ? (connected as { isConnected?: boolean }).isConnected
            : Boolean(connected);
        setHasFreighter(Boolean(isInstalled));

        // Auto-reconnect if previously allowed
        const savedAddress = localStorage.getItem("rhitta_stellar_address");
        if (savedAddress && isInstalled) {
          try {
            const isAllowedRes = await freighter.isAllowed();
            const isAllowed =
              typeof isAllowedRes === "object" && isAllowedRes !== null
                ? (isAllowedRes as { isAllowed?: boolean }).isAllowed
                : Boolean(isAllowedRes);

            if (isAllowed) {
              const addrRes = await freighter.getAddress();
              const addr =
                typeof addrRes === "object" && addrRes !== null
                  ? (addrRes as { address?: string }).address
                  : addrRes;
              if (addr && typeof addr === "string") {
                setAddress(addr);
                try {
                  const net = await freighter.getNetwork();
                  const netName =
                    typeof net === "object" && net !== null
                      ? (net as { network?: string }).network || "TESTNET"
                      : "TESTNET";
                  setNetwork(netName);
                } catch {
                  setNetwork("TESTNET");
                }
              }
            }
          } catch {
            // Ignored on initial check
          }
        }
      } catch (err) {
        console.debug("Freighter detection notice:", err);
        setHasFreighter(false);
      }
    };

    checkFreighter();
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const connected = await freighter.isConnected();
      const isInstalled =
        typeof connected === "object" && connected !== null
          ? (connected as { isConnected?: boolean }).isConnected
          : Boolean(connected);

      if (!isInstalled) {
        addNotification(
          "Freighter Wallet Not Found",
          "Please install the Freighter browser extension from freighter.app to connect to Stellar.",
        );
        window.open("https://www.freighter.app/", "_blank");
        setIsConnecting(false);
        return;
      }

      // Request access
      const accessRes = await freighter.requestAccess();
      const addr =
        typeof accessRes === "object" && accessRes !== null
          ? (accessRes as { address?: string }).address
          : accessRes;

      let finalAddress = typeof addr === "string" ? addr : null;

      if (!finalAddress) {
        const addrRes = await freighter.getAddress();
        const rawAddr =
          typeof addrRes === "object" && addrRes !== null
            ? (addrRes as { address?: string }).address
            : (addrRes as string);
        finalAddress = rawAddr || null;
      }

      if (finalAddress && typeof finalAddress === "string") {
        setAddress(finalAddress);
        localStorage.setItem("rhitta_stellar_address", finalAddress);

        try {
          const net = await freighter.getNetwork();
          const netName =
            typeof net === "object" && net !== null
              ? (net as { network?: string }).network || "TESTNET"
              : "TESTNET";
          setNetwork(netName);
        } catch {
          setNetwork("TESTNET");
        }

        addNotification(
          "Wallet Connected",
          `Connected to Stellar as ${finalAddress.slice(0, 4)}...${finalAddress.slice(-4)}`,
        );
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to connect to Freighter wallet.";
      console.error("Failed to connect Freighter:", err);
      addNotification("Connection Error", message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    localStorage.removeItem("rhitta_stellar_address");
    addNotification("Disconnected", "Stellar wallet disconnected.");
  }, []);

  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : null;

  return (
    <StellarWalletContext.Provider
      value={{
        address,
        shortAddress,
        isConnected: Boolean(address),
        isConnecting,
        hasFreighter,
        network,
        connect,
        disconnect,
      }}
    >
      {children}
    </StellarWalletContext.Provider>
  );
};

export const useStellarWallet = () => useContext(StellarWalletContext);

// Drop-in replacement for wagmi's useAccount
export const useAccount = () => {
  const { address, isConnected } = useStellarWallet();
  return { address, isConnected };
};
