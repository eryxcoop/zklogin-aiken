# Frontend

This package contains the Vite + React frontend for the `zklogin-aiken` demo. It walks a user through the zkLogin session flow, starting with Google OpenID authentication and ending with funding and transferring from a derived zkLogin-backed Cardano address.

The UI is primarily implemented in [`src-frontend/App.tsx`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/App.tsx). The frontend is stateful by design: it persists selected session artifacts in browser storage so the user can move through the flow without re-entering every value.

## What The Frontend Does

The app guides the user through these steps:

1. Generate an ephemeral Ed25519 key pair in the browser.
2. Generate `maxEpoch`, randomness, and a nonce for Google OpenID sign-in.
3. Redirect to Google and decode the returned `id_token`.
4. Create or enter a user salt.
5. Derive a `zkLoginId`, session payload, and derive the wallet address from the local backend.
6. Request a zk proof from the local backend.
7. Fund the derived zkLogin address through the local backend faucet endpoint.
8. Transfer ADA from the zkLogin account through the local backend transfer endpoint.

## Tech Stack

- React 18
- TypeScript
- Vite
- Material UI
- `@mysten/zklogin`
- `@mysten/sui.js`
- `react-router-dom`
- `i18next`

## Prerequisites

- Node.js 18+ recommended
- `npm`
- The backend service in `../backend` running locally
- A Google OAuth client configured to allow the frontend redirect URI

## Install And Run

From the `frontend` directory:

```bash
npm install
npm run dev
```

By default Vite serves the app at `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Local Integration Assumptions

The frontend currently depends on hardcoded local endpoints and constants defined in [`src-frontend/constant.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/constant.ts).

Current defaults:

- Frontend redirect URI: `http://localhost:5173`
- Proof endpoint: `http://localhost:8000/generateProof`
- Funding endpoint: `http://localhost:8000/fundWithFaucet`
- Transfer endpoint: `http://localhost:8000/transfer`
- Address derivation endpoint: `http://localhost:8000/deriveAddress`
- OpenID provider: Google

If you change the frontend host, port, or backend base URL, update the constants in [`src-frontend/constant.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/constant.ts) and the Google OAuth redirect configuration to match.

## Required Backend Endpoints

The UI expects the backend to expose these routes:

- `POST /generateProof`
  Accepts the generated `input_zkLogin.json` payload and returns a proof under `proofContent`.
- `GET /deriveAddress?zkLoginId=...`
  Returns a JSON object containing `walletAddress`.
- `POST /fundWithFaucet`
  Accepts `{ "zkLoginAddress": "<address>" }`.
- `POST /transfer`
  Accepts transfer data including destination, amount, zk proof, and ephemeral session keys.

If any of these routes are missing or return a different shape, the relevant frontend step will fail.

## Browser Storage

The app stores a mix of short-lived and longer-lived data in the browser.

Session storage:

- `demo_ephemeral_key_pair`
- `demo_randomness_key_pair`

Local storage:

- `demo_user_salt_key_pair`
- `demo_max_epoch_key_pair`
- `zk_session_proof`
- `zk_login_id_local_storage_key`
- `eph_public_key_local_storage_key`
- `eph_private_key_local_storage_key`

This behavior is implemented in [`src-frontend/App.tsx`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/App.tsx). The reset action clears both `sessionStorage` and `localStorage`.

## Step-By-Step Flow

### 1. Generate Ephemeral Key Pair

The app creates an in-browser Ed25519 key pair and stores the exported private key in `sessionStorage`. This key pair is used to bind the zk proof to the current session.

### 2. Fetch JWT

The app:

- captures the current time,
- generates randomness,
- derives a nonce from the ephemeral public key, `maxEpoch`, and randomness,
- redirects the user to Google OpenID.

The Google OAuth client ID and redirect URI are defined in [`src-frontend/constant.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/constant.ts).

### 3. Decode JWT

After Google redirects back, the app reads `id_token` from the URL hash, decodes it with `jwt-decode`, and uses the JWT claims as part of later zkLogin derivation.

### 4. Generate Salt

The salt can be randomly generated or entered manually. This value is important: if it is lost, the same derived address cannot be recovered from the same identity context.

### 5. Generate zkLoginId And Session Data

The app:

- computes the `zkLoginId`,
- derives a JSON payload used for proof generation,
- extracts ephemeral public and private key values,
- requests the local backend to derive a wallet address from the `zkLoginId`.

### 6. Generate ZK Proof

The app sends the generated session payload to `POST /generateProof`. On success, the returned proof is stored locally and reused until the current session expires or local state is reset.

### 7. Fund The zkLogin Address

The UI calls `POST /fundWithFaucet` so the backend can send test funds to the derived address. The root project README explains why this custom faucet is needed for the current Cardano-side flow.

### 8. Transfer Funds

The final step posts destination address, amount, zk proof, and ephemeral session material to `POST /transfer`. On success, the app displays the returned transaction hash.

## Notes And Limitations

- The app currently uses hardcoded constants rather than environment variables.
- The project mixes Sui zkLogin libraries with Cardano-specific backend behavior. Read the root [`README.md`](/home/sergio-fedi/projects/work/zklogin-aiken/README.md) for broader project context.
- The UI text still references `maxEpoch`, `TransactionBlock`, and other terms inherited from the original demo implementation.
- Some integration details, such as the address derivation request, are still hardcoded directly in [`src-frontend/App.tsx`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/App.tsx) instead of centralized in configuration.

## Troubleshooting

- If Google login fails, verify that the OAuth client allows `http://localhost:5173` as a redirect URI.
- If proof generation fails, confirm the backend is running on `http://localhost:8000` and that `POST /generateProof` returns `proofContent`.
- If the derived address step fails, verify `GET /deriveAddress` exists and returns `{ "walletAddress": "..." }`.
- If the transfer step fails, check that the funding and proof steps were completed in the same browser state and that the backend accepts the posted payload format.
- If the app behaves inconsistently, use the `Reset LocalState` button to clear cached session data.

## Related Files

- [`src-frontend/App.tsx`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/App.tsx): main UI and flow orchestration
- [`src-frontend/constant.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/constant.ts): frontend configuration constants
- [`src-frontend/lang/resources.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/src-frontend/lang/resources.ts): UI copy for the step labels and descriptions
- [`vite.config.ts`](/home/sergio-fedi/projects/work/zklogin-aiken/frontend/vite.config.ts): Vite configuration
- [`../README.md`](/home/sergio-fedi/projects/work/zklogin-aiken/README.md): repo-level context and backend setup guidance
