# Rhitta Frontend — Stellar Decentralized Music Streaming

The frontend application for **Rhitta** — a real-time decentralized music streaming platform built on **Stellar** and **Soroban**.

## Features

- **Freighter Wallet Integration**: Connect and authenticate with the official Stellar Freighter wallet.
- **Soroban Smart Contracts**: Stream track events, trigger play count updates, and record on-chain music data.
- **Audio Streaming**: Reactive Web Audio player with synchronized playlist controls.
- **Track Uploads & Minting**: Direct uploading and on-chain registration on Stellar Testnet.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **@stellar/freighter-api** (Wallet Connection)
- **@stellar/stellar-sdk** (Soroban RPC & Horizon client)
- **Zustand** (Audio player & store state management)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Configure variables in `.env`:
   ```bash
   VITE_STELLAR_NETWORK=TESTNET
   VITE_STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
   VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   ```

4. Run the development server:
   ```bash
   pnpm run dev
   ```
