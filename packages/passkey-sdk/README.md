# @rohitaggarwal/passkey-sdk

Core WebAuthn + Stellar signing SDK for passkey-based smart accounts. Framework-agnostic — works in any browser environment.

## Install

```bash
npm install @rohitaggarwal/passkey-sdk @stellar/stellar-sdk
```

## API Reference

### `browserCapabilities(): Promise<CapabilityReport>`

Check what passkey features are available before showing any UI. Call this on page load.

```typescript
import { browserCapabilities } from '@rohitaggarwal/passkey-sdk';

const caps = await browserCapabilities();
// caps.webauthn            — WebAuthn API available
// caps.platformAuthenticator — device has Touch ID / Windows Hello / etc.
// caps.conditionalUI       — passkey autofill available

if (!caps.webauthn || !caps.platformAuthenticator) {
  // show fallback (Ed25519 backup key) or unsupported message
}
```

---

### `createWallet(name: string): Promise<WalletCredential>`

Register a new passkey and deploy a Soroban smart wallet contract on Testnet.

```typescript
import { createWallet } from '@rohitaggarwal/passkey-sdk';

const { contractId, credentialId } = await createWallet('My Wallet');
// contractId  — the deployed contract address (C...)
// credentialId — base64url passkey identifier (store this)
```

**What it does:**
1. Calls `navigator.credentials.create()` — the WebAuthn registration ceremony
2. Funds an ephemeral Stellar account via Friendbot (Testnet only)
3. Deploys a new contract instance from the reference WASM hash
4. Calls `add_passkey(credentialId, publicKey)` on the new contract

> ⚠️ Uses Friendbot — Testnet only. Production requires a relayer or user-funded account.

---

### `signTransaction(tx, credentialId, contractId): Promise<Transaction>`

Sign a Stellar transaction's Soroban auth entry using the registered passkey.

```typescript
import { signTransaction } from '@rohitaggarwal/passkey-sdk';

// tx must already be simulated and assembled (auth entries populated)
const signed = await signTransaction(assembledTx, credentialId, contractId);

// signed has the Soroban auth entry set.
// You must still sign the outer envelope with the fee-payer:
signed.sign(feePayer);
await server.sendTransaction(signed);
```

**Parameters:**
- `tx: Transaction` — assembled transaction (after `rpc.assembleTransaction`)
- `credentialId: string` — base64url passkey credential ID from `createWallet`
- `contractId: string` — the smart wallet contract address

---

### `addBackupSigner(contractId, credentialId, backupKeypair): Promise<void>`

Register an Ed25519 keypair as a backup signer. **Call this right after `createWallet`.**

```typescript
import { addBackupSigner } from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';

const backup = Keypair.random();
// Show backup.secret() to the user — they MUST save it somewhere safe
await addBackupSigner(contractId, credentialId, backup);
```

This triggers a passkey ceremony (to authorize the `add_backup` contract call) and submits the transaction to Testnet.

---

### `signWithBackup(tx, backupKeypair, contractId): Promise<Transaction>`

Sign a transaction using the Ed25519 backup key. Use when the passkey device is unavailable.

```typescript
import { signWithBackup } from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';

const keypair = Keypair.fromSecret(userProvidedSecret);
const signed = await signWithBackup(assembledTx, keypair, contractId);
signed.sign(feePayer);
await server.sendTransaction(signed);
```

---

### Low-level utilities

```typescript
import {
  server,        // rpc.Server — pre-configured Soroban Testnet RPC
  buildBaseTx,   // (sourcePublicKey) => Promise<TransactionBuilder>
  TESTNET_RPC_URL,
  base64urlEncode,
  base64urlDecode,
} from '@rohitaggarwal/passkey-sdk';
```

**`server`** — pre-configured `rpc.Server` pointed at `https://soroban-testnet.stellar.org`. Use it to simulate/submit transactions.

**`buildBaseTx(sourcePublicKey)`** — returns a `TransactionBuilder` with the account loaded from the RPC, `fee: '1000000'`, 30-second timeout. Add operations, then call `.build()`.

---

## Types

```typescript
interface CapabilityReport {
  webauthn: boolean;
  platformAuthenticator: boolean;
  conditionalUI: boolean;
}

interface WalletCredential {
  contractId: string;   // Soroban contract address (C...)
  credentialId: string; // base64url WebAuthn credential ID
}
```

---

## Deployed Contract (Testnet)

| | |
|---|---|
| WASM hash | `561755cf54c80213a1fb7e63cd14f5181707656959bb51a54d553473e99709a3` |
| Network | `Test SDF Network ; September 2015` |

Each `createWallet` call deploys a **new instance** of this WASM. The WASM hash is baked into `WALLET_WASM_HASH` in `soroban.ts`.

> ⚠️ The reference contract is unaudited. Do not use in production.
