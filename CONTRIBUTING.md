# Contributing to Rhitta

Thank you for your interest in contributing to Rhitta! We welcome contributions to smart contracts, backend services, and frontend applications.

## Branching Strategy

- **Default Branch**: `dev` is the primary integration branch for ongoing development.
- **Production / Releases**: `master` (or `main`) is reserved for stable production releases.
- **Feature Branches**: Please branch off `dev` and open all Pull Requests targeting `dev`.
  - Format: `feature/<descriptive-name>`, `fix/<descriptive-name>`, or `refactor/<descriptive-name>`.

```bash
# Clone the repository
git clone https://github.com/Kaycee276/Rhitta.git
cd Rhitta

# Switch to the dev branch and create your feature branch
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
```

---

## Repository Structure

- [`contracts/`](./contracts): Soroban smart contracts written in Rust.
- [`backend/`](./backend): Node.js + Express API, Prisma ORM, Turso LibSQL, and Stellar publisher/subscriber services.
- [`frontend/`](./frontend): React 19 + TypeScript + Vite web application using Freighter / Stellar wallets.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (`corepack enable && corepack prepare pnpm@latest --activate`)
- [Rust & Cargo](https://rustup.rs/) (stable toolchain)
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) (v22+)

---

## Quality Checks & CI Workflow

Our CI workflow checks code quality across all three components on push and pull requests to `dev`. Please verify that the respective checks pass locally before opening a pull request.

### 1. Smart Contracts (`contracts/`)

```bash
cd contracts
cargo fmt --all -- --check
cargo clippy --all-targets -- -D warnings
cargo test
```

To auto-format:
```bash
cargo fmt --all
```

### 2. Backend (`backend/`)

```bash
cd backend
pnpm install
pnpm run format:check
pnpm run lint
pnpm run build
```

To auto-format:
```bash
pnpm run format
```

### 3. Frontend (`frontend/`)

```bash
cd frontend
pnpm install
pnpm run format:check
pnpm run lint
pnpm run typecheck
pnpm run build
```

To auto-format:
```bash
pnpm run format
```

---

## Pull Request Guidelines

1. Ensure all formatting, linting, and build/test steps pass locally.
2. Commit your changes with clear, descriptive commit messages adhering to [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`, `ci:`).
3. Push your feature branch and open a PR targeting `dev`.
4. Provide a summary of changes, linked issue numbers, and testing steps in the PR description.
