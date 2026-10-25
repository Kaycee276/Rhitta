# 🎵 Rhitta - Decentralized Music Streaming Platform on Stellar

<div align="center">

![Rhitta Logo](https://img.shields.io/badge/Rhitta-Music%20Streaming-blue?style=for-the-badge)
![Stellar](https://img.shields.io/badge/Powered%20by-Stellar%20%26%20Soroban-black?style=for-the-badge&logo=stellar)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Real-time, decentralized music streaming powered by Stellar and Soroban smart contracts**

[Features](#-features) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack) • [Smart Contracts](#-smart-contracts) • [Setup](#-setup)

</div>

---

## 📖 Overview

**Rhitta** is a next-generation decentralized music streaming platform built on the **Stellar Network** and powered by **Soroban** WebAssembly (WASM) smart contracts. Rhitta transforms how listeners discover, stream, and interact with artists through instant on-chain track registration, transparent play accounting, and automated micro-royalty payouts.

By building on Stellar, Rhitta benefits from:

- ⚡ **Sub-second to 3–5s finality** and near-zero transaction fees
- 🛡️ **Soroban Smart Contracts**: High-performance, memory-safe Rust smart contracts compiled to WASM
- 💰 **Native Assets & Stellar USDC**: Direct micro-payments and royalty distributions in XLM or USDC
- 👛 **Freighter Wallet Integration**: Seamless authentication and transaction signing for users and creators
- 📊 **Real-time On-Chain Events**: Contract events emitted for track publishing, plays, and tip distributions

---

## ✨ Features

### 🎧 Core Features

- **Real-Time Music Streaming**: Low-latency web audio player with queue management and playback controls
- **On-Chain Track Registry**: Every song is indexed and cataloged directly on the Stellar ledger
- **Verifiable Play Counts**: Play events are verified on-chain via the `rhitta-music` Soroban contract
- **Artist Tipping & Royalties**: Direct, frictionless creator support using native Stellar assets (XLM) or stablecoins (USDC)
- **Freighter Wallet Connect**: Fast, non-custodial wallet connection and account identification (`G...`)
- **Dynamic Trending & Discovery**: Catalog browsing with genre filtering and on-chain play metrics

---

## 🏗️ How It Works

### Soroban & Stellar Architecture

```
┌─────────────────────────────────┐
│     Frontend (React + Vite)     │
│   - Freighter Wallet Connector  │
│   - Stellar SDK (Soroban RPC)   │
└────────────────┬────────────────┘
                 │
                 │ 1. Connect & Sign
                 ▼
┌─────────────────────────────────┐
│   Freighter / Stellar Network   │
│   - Account Auth (G...)         │
│   - Testnet / Public Network    │
└────────────────┬────────────────┘
                 │
                 │ 2. Contract Calls & Events
                 ▼
┌─────────────────────────────────┐
│   Soroban Smart Contracts       │
│   (rhitta-music in Rust/WASM)   │
│   - publish_song(...)           │
│   - record_play(...)            │
│   - get_song(...)               │
│   - SongPublishedEvent          │
│   - SongPlayedEvent             │
└─────────────────────────────────┘
```

### Key On-Chain Workflows

1. **Track Registration**: Creators upload audio and cover art, signing a `publish_song` transaction that records the track on Soroban with title, artist address, duration, price, and storage references.
2. **Play Event & Analytics**: As listeners stream tracks, `record_play` updates play counters and emits typed contract events.
3. **Decentralized Storage**: Audio files and artwork are preserved with resilient content hashes.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **@stellar/freighter-api**: Official Stellar wallet interface
- **@stellar/stellar-sdk**: Stellar Horizon client & Soroban RPC integration
- **Zustand**: Audio player state and playlist stores

### Backend
- **Node.js** + **TypeScript** + **Express**
- **@stellar/stellar-sdk**: Account management, transaction submission, and contract interaction
- **Multer** & **music-metadata**: Audio duration extraction and file processing
- **Supabase**: Relational database storage and file hosting

### Smart Contracts
- **Stellar Soroban SDK v27**
- **Rust** (compiled to `wasm32-unknown-unknown`)
- Built-in test suite with mock authorizations

---

## 📜 Smart Contracts

The Soroban contracts are located in the [`contracts/`](file:///home/kaycee/Desktop/Personal/Rhitta/contracts) directory.

### Contract Methods (`RhittaMusicContract`)

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `init` | `admin: Address` | Initializes contract with admin address |
| `publish_song` | `artist: Address, id: String, title: String, artist_name: String, cover_art: String, audio_url: String, genre: String, duration: u32, price: i128` | Registers a new track on-chain |
| `record_play` | `song_id: String` | Increments play count and emits a `SongPlayedEvent` |
| `get_song` | `song_id: String` | Fetches track details from contract storage |
| `get_song_count` | *none* | Returns total published track count |
| `get_song_by_index`| `index: u32` | Retrieves a song by catalog index |

### Testing Contracts

```bash
cd contracts
cargo test
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Rust and `cargo` (with `wasm32-unknown-unknown` target for Soroban)
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Installation

1. Clone the repository and install dependencies:
   ```bash
   # Install Frontend
   cd frontend
   npm install

   # Install Backend
   cd ../backend
   npm install
   ```

2. Configure environment variables:
   - In `backend/`: Copy `.env.example` to `.env` and configure your Stellar keys and Supabase credentials.
   - In `frontend/`: Copy `.env.example` to `.env` and set `VITE_STELLAR_SOROBAN_RPC_URL` and `VITE_STELLAR_HORIZON_URL`.

3. Start development servers:
   ```bash
   # In backend/
   npm run dev

   # In frontend/
   npm run dev
   ```

---

## 📄 License

MIT
