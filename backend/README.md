# Rhitta Backend — Stellar & Soroban Service

Backend service for Rhitta that bridges song management, Supabase storage, and Stellar / Soroban on-chain music registration.

## Architecture

- **Blockchain Layer**: Stellar Testnet & Soroban WASM Smart Contracts (`rhitta-music`)
- **Stellar SDK**: Interacts with Soroban RPC (`https://soroban-testnet.stellar.org`) and Stellar Horizon (`https://horizon-testnet.stellar.org`)
- **Metadata & Audio Storage**: Supabase Storage / IPFS
- **API**: Express REST endpoints for track upload and publishing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Fill in your Stellar credentials:
   - `STELLAR_SECRET_KEY`: Your Stellar account secret key (begins with `S`)
   - `STELLAR_PUBLIC_KEY`: Your Stellar account public key (begins with `G`)
   - `STELLAR_CONTRACT_ID`: (Optional) Deployed Soroban `rhitta-music` contract ID

4. Run the development server:
   ```bash
   npm run dev
   ```

## Endpoints

- `POST /new-upload`: Upload track audio and cover art, store metadata in Supabase, and register on Stellar.
- `POST /publish-songs`: Batch publish unpublished tracks to Stellar.
- `GET /health`: Health check.
