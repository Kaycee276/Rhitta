# Rhitta Backend — Stellar & Turso SQLite Service

Backend service for Rhitta that bridges song management, Prisma ORM with Turso (cloud SQLite/libSQL), and Stellar / Soroban on-chain track registration.

## Architecture

- **Database Layer**: **Prisma ORM** + **Turso LibSQL** (cloud SQLite) with local SQLite fallback (`dev.db`)
- **Blockchain Layer**: Stellar Testnet & Soroban WASM Smart Contracts (`rhitta-music`)
- **Stellar SDK**: Interacts with Soroban RPC (`https://soroban-testnet.stellar.org`) and Stellar Horizon (`https://horizon-testnet.stellar.org`)
- **File Storage**: Local uploads (`/uploads`) with optional Supabase storage support
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

3. Configure your Database & Stellar credentials:
   - **For local dev**: `DATABASE_URL=file:dev.db`
   - **For Turso Cloud**:
     - `TURSO_DATABASE_URL=libsql://<your-db>-<your-org>.turso.io`
     - `TURSO_AUTH_TOKEN=<your-turso-auth-token>`
   - `STELLAR_SECRET_KEY`: Stellar secret key (`S...`)
   - `STELLAR_PUBLIC_KEY`: Stellar public key (`G...`)
   - `STELLAR_CONTRACT_ID`: (Optional) Deployed Soroban contract ID

4. Push schema to your database:
   ```bash
   npx prisma db push
   ```

5. Run development server:
   ```bash
   npm run dev
   ```

## Endpoints

- `POST /new-upload`: Upload track audio and cover art, store record in Turso/SQLite via Prisma, and register on Stellar.
- `POST /publish-songs`: Batch publish unpublished tracks to Stellar.
- `GET /health`: Health check.
