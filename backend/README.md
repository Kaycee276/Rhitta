# Rhitta backend (TypeScript)

Minimal backend that bridges Somnia Data Streams to frontend clients via WebSocket and a small HTTP API. It uses the Somnia SDK when configured; otherwise it falls back to a mock event generator for local development.

Quick start

1. cd backend
2. copy `.env.example` to `.env` and set values (SOMNIA_RPC_URL if you have it)
3. npm install
4. npm run dev

Endpoints

- GET /health — basic health check
- GET /events — returns buffered recent events

WebSocket

- Connect to ws://localhost:4000/ — on connect you receive a `buffer` message with recent events.
- New events are broadcast as messages: { type: 'event', data: { ... } }
  Rhitta backend

This minimal backend connects to Somnia Data Streams and broadcasts events to connected frontend clients via WebSockets. It also exposes a small HTTP API to fetch recent events.

Setup

1. cd backend
2. npm install
3. Copy `.env.example` to `.env` and fill SOMNIA\_\* values if you have them.
4. npm start

Endpoints

- WebSocket server: ws://localhost:PORT (default 4000) — receives JSON events pushed from Somnia
- GET /events — returns recent buffered events

Notes

- If Somnia env vars are missing, the server will use mock events (useful for local dev).
- You can adapt this to use SSE or socket.io if preferred.
