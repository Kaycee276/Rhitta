# 🎵 Rhitta - Decentralized Music Streaming Platform

<div align="center">

![Rhitta Logo](https://img.shields.io/badge/Rhitta-Music%20Streaming-red?style=for-the-badge)
![Somnia](https://img.shields.io/badge/Powered%20by-Somnia%20Data%20Streams-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**Real-time, decentralized music streaming powered by Somnia Data Streams**

[Features](#-features) • [How It Works](#-how-it-works) • [Tech Stack](#-tech-stack) • [Setup](#-setup) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**Rhitta** is a next-generation decentralized music streaming platform that leverages **Somnia Data Streams (SDS)** to deliver real-time, reactive music experiences on the blockchain. Built for the Somnia Data Streams Mini Hackathon, Rhitta transforms how users discover, stream, and interact with music through instant on-chain data streams.

Unlike traditional streaming platforms that rely on centralized servers and delayed updates, Rhitta uses Somnia's breakthrough data streaming protocol to provide:

- ⚡ **Instant updates** as music plays
- 📊 **Real-time analytics** and play counts
- 💰 **Live royalty distribution**
- 🎯 **Reactive playlists** that update instantly
- 🔥 **Live trending charts** powered by on-chain data

---

## ✨ Features

### 🎧 Core Features

- **Real-Time Music Streaming**: Stream music with instant playback and zero latency
- **Live Play Counts**: Watch play counts update in real-time as songs are played globally
- **Dynamic Trending Charts**: Real-time trending charts that react instantly to on-chain activity
- **Smart Playlists**: Playlists that automatically update based on real-time data streams
- **Artist Dashboard**: Real-time analytics for artists showing plays, earnings, and listener engagement
- **NFT Music Tokens**: Each track is minted as an NFT on Somnia Testnet
- **Instant Royalty Distribution**: Automatic, real-time royalty payments to artists

### 🔴 Real-Time Features Powered by SDS

- **Live Listener Counts**: See how many people are listening to a track right now
- **Instant Play Updates**: Play counts update immediately across all users
- **Real-Time Comments**: Live comment streams synchronized across all clients
- **Dynamic Pricing**: Song prices that react to demand in real-time
- **Instant Notifications**: Get notified instantly when your favorite artists release new music

---

## 🏗️ How It Works

### Somnia Data Streams Integration

Rhitta leverages **Somnia Data Streams SDK** to create reactive data streams from on-chain events:

1. **Music NFT Minting**: When an artist uploads a track, it's minted as an NFT on Somnia Testnet
2. **Stream Creation**: SDS creates real-time streams for:

   - Play events (when a song is played)
   - Purchase events (when a song is bought)
   - Like/favorite events
   - Comment events
   - Royalty distribution events

3. **Reactive UI**: The frontend subscribes to these streams and updates instantly:
   - Play counts increment in real-time
   - Trending charts reorder automatically
   - Artist earnings update live
   - Playlists refresh instantly

### Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React + TS)  │
└────────┬────────┘
         │
         │ Subscribes to
         │ Data Streams
         ▼
┌─────────────────┐
│  Somnia Data    │
│  Streams SDK    │
└────────┬────────┘
         │
         │ Monitors
         │ On-Chain Events
         ▼
┌─────────────────┐
│  Smart Contracts│
│  (Somnia L1)    │
│  - MusicNFT     │
│  - Marketplace  │
│  - Royalties    │
└─────────────────┘
```

### Key Data Streams

1. **Play Stream**: Real-time stream of all play events

   - Updates play counts instantly
   - Powers live listener counts
   - Feeds trending algorithms

2. **Purchase Stream**: Stream of NFT purchases

   - Updates ownership in real-time
   - Triggers royalty distribution
   - Updates marketplace listings

3. **Interaction Stream**: Likes, comments, favorites

   - Real-time social engagement
   - Instant UI updates
   - Live activity feeds

4. **Royalty Stream**: Real-time royalty payments
   - Instant artist earnings
   - Live payment notifications
   - Transparent revenue tracking

---

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Somnia Data Streams SDK** - Real-time data streaming
- **Ethers.js / viem** - Blockchain interactions
- **Web3Modal / Wagmi** - Wallet connectivity

### Blockchain

- **Somnia L1** - High-performance EVM-compatible blockchain
- **Solidity** - Smart contract development
- **Hardhat / Foundry** - Development framework
- **IPFS / Arweave** - Decentralized music storage

### Infrastructure

- **Somnia Data Streams** - Real-time data protocol
- **Somnia Testnet** - Deployment environment

---

## 🚀 Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- MetaMask or compatible Web3 wallet
- Somnia Testnet tokens (request from Telegram group)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Rhitta
   ```

2. **Install dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Install Somnia Data Streams SDK**

   ```bash
   npm install @somnia-network/datastreams-sdk
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   VITE_SOMNIA_RPC_URL=https://testnet-rpc.somnia.network
   VITE_SOMNIA_CHAIN_ID=12345
   VITE_CONTRACT_ADDRESS=0x...
   VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:4444
   ```

### Smart Contract Setup

1. **Install Hardhat**

   ```bash
   npm install --save-dev hardhat
   npx hardhat init
   ```

2. **Configure Hardhat for Somnia**

   ```javascript
   // hardhat.config.js
   networks: {
     somniaTestnet: {
       url: "https://testnet-rpc.somnia.network",
       chainId: 12345,
       accounts: [process.env.PRIVATE_KEY]
     }
   }
   ```

3. **Deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network somniaTestnet
   ```

---

## 📱 Usage

### For Listeners

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Browse Music**: Explore trending tracks, new releases, and playlists
3. **Stream Music**: Click play to start streaming (requires purchasing the NFT)
4. **Real-Time Updates**: Watch play counts, listener counts, and charts update live
5. **Interact**: Like, comment, and favorite tracks in real-time

### For Artists

1. **Upload Music**: Upload your track (stored on IPFS)
2. **Mint NFT**: Create an NFT for your track on Somnia
3. **Set Price**: Set the purchase price for your track
4. **Monitor**: Watch real-time analytics, plays, and earnings
5. **Earn**: Receive instant royalty payments as your music is played

---

## 🎯 Somnia Data Streams Implementation

### Example: Real-Time Play Count

```typescript
import { DataStreamsClient } from "@somnia-network/datastreams-sdk";

const client = new DataStreamsClient({
	rpcUrl: import.meta.env.VITE_SOMNIA_RPC_URL,
	chainId: import.meta.env.VITE_SOMNIA_CHAIN_ID,
});

// Subscribe to play events
const playStream = client.createStream({
	contractAddress: MUSIC_NFT_CONTRACT,
	eventName: "SongPlayed",
	filters: { songId: currentSongId },
});

playStream.subscribe((event) => {
	// Update play count instantly
	setPlayCount(event.data.playCount);
	setListenerCount(event.data.currentListeners);
});
```

### Example: Real-Time Trending Chart

```typescript
// Stream all play events and calculate trending
const trendingStream = client.createStream({
	contractAddress: MUSIC_NFT_CONTRACT,
	eventName: "SongPlayed",
	aggregation: {
		window: "1h",
		groupBy: "songId",
		orderBy: "count",
		limit: 10,
	},
});

trendingStream.subscribe((events) => {
	// Chart updates automatically as events stream in
	setTrendingSongs(events);
});
```

---

## 🚢 Deployment

### Deploy to Somnia Testnet

1. **Build the frontend**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**

   ```bash
   # Vercel
   vercel deploy

   # Netlify
   netlify deploy --prod
   ```

3. **Update contract addresses** in production environment variables

4. **Verify deployment** on Somnia Testnet explorer

### Smart Contract Deployment

```bash
# Deploy MusicNFT contract
npx hardhat run scripts/deploy.js --network somniaTestnet

# Verify contract
npx hardhat verify --network somniaTestnet <CONTRACT_ADDRESS>
```

---

## 📊 Project Structure

```
Rhitta/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks for SDS
│   │   ├── services/        # SDS client & blockchain services
│   │   ├── contracts/       # Contract ABIs
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── contracts/
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/             # Deployment scripts
│   └── test/                # Contract tests
└── README.md
```

---

## 🎨 Design

Rhitta features a modern, sleek design with a **red theme** that represents passion, energy, and the vibrant music culture. The UI is designed for:

- **Dark mode** by default for immersive listening
- **Responsive design** for all devices
- **Smooth animations** for real-time updates
- **Intuitive navigation** for seamless music discovery

---

## 🧪 Testing

### Frontend Tests

```bash
npm run test
```

### Smart Contract Tests

```bash
cd contracts
npx hardhat test
```

---

## 📝 Submission Requirements

✅ **Public GitHub Repo** - This repository  
✅ **Working Web3 dApp** - Deployed on Somnia Testnet  
✅ **Demo Video** - 3-5 minute walkthrough  
✅ **README** - Comprehensive documentation (this file)

---

## 🏆 Hackathon Goals

- ✅ Integrate Somnia Data Streams SDK
- ✅ Build functional prototype with real-time features
- ✅ Deploy on Somnia Testnet
- ✅ Demonstrate reactive, structured data streams
- ✅ Showcase real-time UX capabilities

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Please feel free to:

- Report bugs
- Suggest features
- Submit pull requests

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **Somnia Docs**: https://docs.somnia.network
- **Data Streams Info**: https://datastreams.somnia.network
- **Somnia X**: https://x.com/SomniaEco
- **Telegram**: https://t.me/+XHq0F0JXMyhmMzM0

---

## 👥 Team

Built with ❤️ for the **Somnia Data Streams Mini Hackathon 2025**

---

## 🙏 Acknowledgments

- Somnia Network for the amazing Data Streams SDK
- The hackathon organizers and mentors
- The Web3 music community

---

<div align="center">

**Made with 🎵 and ⚡ by the Rhitta Team**

[⬆ Back to Top](#-rhitta---decentralized-music-streaming-platform)

</div>
