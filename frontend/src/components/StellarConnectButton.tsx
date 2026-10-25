import React, { useState } from "react";
import {
  Wallet,
  ExternalLink,
  Copy,
  LogOut,
  ChevronDown,
  Check,
} from "lucide-react";
import { useStellarWallet } from "../context/StellarWalletContext";
import { useClickOutside } from "../utils/useClickOutside";

export const StellarConnectButton: React.FC = () => {
  const {
    address,
    shortAddress,
    isConnected,
    isConnecting,
    network,
    connect,
    disconnect,
  } = useStellarWallet();

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const menuRef = useClickOutside<HTMLDivElement>(
    () => setIsOpen(false),
    isOpen,
  );

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-full transition-all duration-200 shadow-md hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
      >
        <Wallet className="w-4 h-4" />
        {isConnecting ? "Connecting..." : "Connect Stellar"}
      </button>
    );
  }

  const explorerUrl = `https://stellar.expert/explorer/${
    network?.toLowerCase() === "public" ? "public" : "testnet"
  }/account/${address}`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3.5 py-1.5 text-sm font-medium bg-(--bg-tertiary) hover:bg-(--bg-secondary) border border-(--border) rounded-full transition-colors duration-150"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs uppercase tracking-wider text-(--text-secondary) font-mono">
          {network || "Testnet"}
        </span>
        <span className="text-(--text) font-mono font-medium">
          {shortAddress}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-(--text-secondary) transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 py-2 bg-(--bg-secondary) border border-(--border) rounded-xl shadow-xl z-50 backdrop-blur-md">
          <div className="px-3 py-2 border-b border-(--border) mb-1">
            <p className="text-xs text-(--text-tertiary)">Connected Account</p>
            <p className="text-xs font-mono text-(--text) truncate mt-0.5">
              {address}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-(--text-secondary) hover:text-(--text) hover:bg-(--bg-tertiary) transition-colors text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied address" : "Copy Address"}
          </button>

          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-(--text-secondary) hover:text-(--text) hover:bg-(--bg-tertiary) transition-colors text-left"
          >
            <ExternalLink className="w-4 h-4" />
            View on Stellar Expert
          </a>

          <div className="border-t border-(--border) my-1" />

          <button
            onClick={() => {
              disconnect();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default StellarConnectButton;
