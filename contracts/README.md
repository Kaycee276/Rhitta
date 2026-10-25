# Rhitta Soroban Smart Contracts

Smart contracts for **Rhitta** — decentralized music streaming platform on the **Stellar Network** using **Soroban SDK v27**.

## Contract Overview (`rhitta-music`)

The `RhittaMusicContract` implements on-chain music track registration, play event recording, catalog querying, and event emissions.

### Methods

| Function | Parameters | Description |
| :--- | :--- | :--- |
| `init` | `admin: Address` | Sets the initial administrator address. Can only be invoked once. |
| `publish_song` | `artist: Address, id: String, title: String, artist_name: String, cover_art: String, audio_url: String, genre: String, duration: u32, price: i128` | Registers a track on-chain, requiring authorization from `artist`. Emits `SongPublishedEvent`. |
| `record_play` | `song_id: String` | Increments verified stream count and emits `SongPlayedEvent`. |
| `get_song` | `song_id: String` | Retrieves stored metadata and play count for a track. |
| `get_song_count` | *none* | Returns the total count of songs published in the catalog. |
| `get_song_by_index` | `index: u32` | Returns track data by sequential index. |

---

## Deployed Contract (Stellar Testnet)

- **Contract ID**: [`CBQU2AB6ZEGNCMMXPPXOMGCHFXEBGU3EL7OC2PSLDTI4JKE5GT6XCPDC`](https://stellar.expert/explorer/testnet/contract/CBQU2AB6ZEGNCMMXPPXOMGCHFXEBGU3EL7OC2PSLDTI4JKE5GT6XCPDC)
- **WASM Hash**: `09d8412cf7c6f1c2733c04dac95de924ee1dd6ce02840606db0decddc44c24df`
- **Network**: Stellar Testnet
- **Admin**: `GBELXTVUSO745SBIL6OINE3FR3YB4BTXKOL5BY7LK6GC5AOQJCZOVMBX`

---

## Development & Testing

### Prerequisites

- [Rust](https://rustup.rs/) (stable toolchain)
- `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) (v22+)

### Run Checks & Tests

```bash
# Check formatting
cargo fmt --all -- --check

# Run linter
cargo clippy --all-targets -- -D warnings

# Run unit tests
cargo test
```

### Build Contract WASM

```bash
cargo build --target wasm32-unknown-unknown --release
```
