# Development Guide

This guide details local development workflows, local CI validation, and environment setup for **Rhitta**.

## Prerequisites

- **Node.js**: v20+ (v22 recommended)
- **pnpm**: v10+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Rust**: Stable toolchain (`rustup default stable`)
- **Cargo WASM Target**: `rustup target add wasm32-unknown-unknown`
- **Stellar CLI**: v22+ (`cargo install --locked stellar-cli --features opt`)

---

## 🔍 Running CI Checks Locally

Before opening a Pull Request targeting `dev`, execute all checks locally according to the components you modified:

### 1. Smart Contracts (`contracts/`)

```bash
cd contracts

# 1. Format check
cargo fmt --all -- --check

# 2. Clippy linter
cargo clippy --all-targets -- -D warnings

# 3. Unit tests
cargo test
```

### 2. Backend (`backend/`)

```bash
cd backend

# 1. Format check
pnpm run format:check

# 2. Type-check & lint
pnpm run lint

# 3. Production build
pnpm run build
```

### 3. Frontend (`frontend/`)

```bash
cd frontend

# 1. Format check
pnpm run format:check

# 2. Linter
pnpm run lint

# 3. TypeScript compilation check
pnpm run typecheck

# 4. Production build
pnpm run build
```

---

## 🏃 Running the Full Stack Locally

1. **Start Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Ensure DATABASE_URL=file:./dev.db
   pnpm run db:push
   pnpm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   pnpm run dev
   ```

3. **Interact with Contracts**:
   ```bash
   cd contracts
   cargo test
   ```
