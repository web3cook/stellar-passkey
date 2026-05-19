# stellar-passkey

A minimal, composable passkey SDK and UI component library for Stellar smart accounts.

Built in response to the [SCF Build Award — Passkey UI RFP](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track#passkey-ui).

## What This Is

Every Stellar team building passkey authentication rediscovers the same WebAuthn knowledge from scratch. This repo solves that with:

- **`@rohitaggarwal/passkey-sdk`** — core WebAuthn + Stellar signing logic, framework-agnostic
- **`@rohitaggarwal/passkey-ui`** — Web Components for register / sign / recover flows
- **`@rohitaggarwal/wallets-kit-adapter`** — connector for `@creit.tech/stellar-wallets-kit`
- **Reference Soroban contract** — minimal secp256r1 smart wallet (for POC; unaudited)
- **Compatibility matrix** — tested browser/device data so you don't have to re-learn it
- **Usage guide** — known issues, fallback patterns, integration walkthrough

## Live Demo

Deploy to Vercel by connecting this repo; `vercel.json` is already configured. WebAuthn requires HTTPS — the deployed URL works out of the box.

## Packages

| Package | Description |
|---|---|
| [`packages/passkey-sdk`](./packages/passkey-sdk) | Core SDK |
| [`packages/passkey-ui`](./packages/passkey-ui) | Web Components |
| [`packages/wallets-kit-adapter`](./packages/wallets-kit-adapter) | stellar-wallets-kit connector |
| [`apps/demo`](./apps/demo) | Vite demo app |
| [`contracts/passkey-wallet`](./contracts/passkey-wallet) | Soroban reference contract (Rust) |
| [`docs/compatibility-matrix.md`](./docs/compatibility-matrix.md) | Browser/device compatibility |
| [`docs/usage-patterns.md`](./docs/usage-patterns.md) | Integration guide & known issues |

## How It Works

```
Registration
  navigator.credentials.create()
    → P-256 keypair on device (Touch ID / Windows Hello / Face ID)
    → Soroban contract deployed via createCustomContract
    → add_passkey(credentialId, publicKey) stored in contract

Signing
  navigator.credentials.get()
    → WebAuthn assertion (authenticatorData + clientDataJSON + DER sig)
    → DER sig → raw 64-byte r||s
    → AccountSignature ScVal encoded into SorobanAuthorizationEntry
    → Contract verifies: sha256(authenticatorData || sha256(clientDataJSON))

Recovery
  Keypair.fromSecret(backupSecret)
    → Ed25519 sign of the same 32-byte auth payload
    → Contract verifies via ed25519_verify
```

## Quick Start (SDK)

```bash
npm install @rohitaggarwal/passkey-sdk @stellar/stellar-sdk
```

```typescript
import { browserCapabilities, createWallet, signTransaction, addBackupSigner } from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';

const caps = await browserCapabilities();
if (!caps.webauthn) { /* show fallback */ }

const { contractId, credentialId } = await createWallet('My Wallet');

const backup = Keypair.random();
await addBackupSigner(contractId, credentialId, backup);
// show backup.secret() to the user — they must save it

const signed = await signTransaction(assembledTx, credentialId, contractId);
signed.sign(feePayer);
await server.sendTransaction(signed);
```

## Quick Start (Web Components)

```html
<script type="module" src="https://unpkg.com/@rohitaggarwal/passkey-ui"></script>

<pk-register name="My Wallet"></pk-register>

<script>
  document.addEventListener('pk-success', e => {
    const { contractId, credentialId } = e.detail;
  });
</script>
```

## Deployed Contract (Testnet)

| | |
|---|---|
| Contract ID | `CAPB5KP6I6WX7CUXYB6CQKSQDLBMN2HJ3J3NQZNZDZTAXXIJ7EY4MJET` |
| WASM hash | `561755cf54c80213a1fb7e63cd14f5181707656959bb51a54d553473e99709a3` |
| Network | Testnet (`Test SDF Network ; September 2015`) |
| Explorer | [stellar.expert/explorer/testnet/contract/…](https://stellar.expert/explorer/testnet/contract/CAPB5KP6I6WX7CUXYB6CQKSQDLBMN2HJ3J3NQZNZDZTAXXIJ7EY4MJET) |

> ⚠️ The reference contract is **unaudited** and for demonstration only.

## Development

```bash
# prerequisites: Node 20+, pnpm 9+, Rust 1.84+ (for contract builds)
pnpm install
pnpm dev          # demo app at http://localhost:5173
pnpm typecheck    # type-check all packages
pnpm test         # run tests
pnpm build        # build all packages (not demo)
pnpm --filter demo build  # production build of demo app
```

## Repository Structure

```
packages/
  passkey-sdk/          # Core SDK — no UI, no framework
  passkey-ui/           # Web Components wrapping the SDK
  wallets-kit-adapter/  # stellar-wallets-kit connector
apps/
  demo/                 # Vite + TypeScript demo on Testnet
contracts/
  passkey-wallet/       # Soroban contract (Rust)
docs/
  compatibility-matrix.md
  usage-patterns.md
```

## License

MIT
