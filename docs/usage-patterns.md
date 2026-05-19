# Usage Patterns & Integration Guide

This document covers common integration patterns, known issues, and recommended approaches for building with `@rohitaggarwal/passkey-sdk`.

For browser/device compatibility, see [`compatibility-matrix.md`](./compatibility-matrix.md).

---

## Quick Start

```typescript
import {
  browserCapabilities,
  createWallet,
  signTransaction,
  addBackupSigner,
  signWithBackup,
} from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';

// 1. Check support before showing any passkey UI
const caps = await browserCapabilities();
if (!caps.webauthn || !caps.platformAuthenticator) {
  // Show Ed25519 backup key flow or unsupported message
  return;
}

// 2. Create wallet — triggers WebAuthn registration, deploys Soroban contract
const { contractId, credentialId } = await createWallet('My Wallet');
// Persist these — you need both for every future sign
localStorage.setItem('contractId', contractId);
localStorage.setItem('credentialId', credentialId);

// 3. Register a backup key immediately (strongly recommended)
const backup = Keypair.random();
// Show backup.secret() to the user — they must save it
await addBackupSigner(contractId, credentialId, backup);

// 4. Sign a transaction (tx must already be simulated and assembled)
const signedTx = await signTransaction(tx, credentialId, contractId);
// signedTx has Soroban auth entries set — caller must still sign outer envelope
// with the fee-payer keypair and submit.
```

---

## Transaction Signing in Detail

`signTransaction` sets the **Soroban authorization entry** on the transaction (the smart wallet's proof of consent). It does NOT sign the outer Stellar transaction envelope — that is the fee-payer's job and is done separately.

```typescript
import {
  buildBaseTx,
  server,
  signTransaction,
  TESTNET_RPC_URL,
} from '@rohitaggarwal/passkey-sdk';
import {
  Keypair,
  Operation,
  nativeToScVal,
  rpc,
  type Transaction,
} from '@stellar/stellar-sdk';

async function buildAndSign(
  contractId: string,
  credentialId: string,
  feePayer: Keypair,
): Promise<string> {                     // returns submitted tx hash
  // 1. Build the transaction (fee-payer is the source account)
  const builder = await buildBaseTx(feePayer.publicKey());
  const raw = builder
    .addOperation(
      Operation.invokeContractFunction({
        contract: contractId,
        function: 'your_function',
        args: [ /* ... */ ],
      }),
    )
    .build();

  // 2. Simulate to populate auth entries
  const sim = await server.simulateTransaction(raw);
  if (!rpc.Api.isSimulationSuccess(sim)) throw new Error('Simulation failed');
  const assembled = rpc.assembleTransaction(raw, sim).build() as Transaction;

  // 3. Passkey signs the Soroban auth entry (WebAuthn ceremony)
  const signed = await signTransaction(assembled, credentialId, contractId);

  // 4. Fee-payer signs the outer envelope
  signed.sign(feePayer);

  // 5. Submit
  const sent = await server.sendTransaction(signed);
  if (sent.status === 'ERROR') throw new Error(JSON.stringify(sent.errorResult));
  await server.pollTransaction(sent.hash);
  return sent.hash;
}
```

---

## Sending XLM from a Smart Wallet

The smart wallet contract can hold and send XLM via the native Stellar Asset Contract (SAC). This makes the passkey wallet a true on-chain account.

```typescript
import {
  buildBaseTx,
  server,
  signTransaction,
} from '@rohitaggarwal/passkey-sdk';
import {
  Address,
  Asset,
  Keypair,
  nativeToScVal,
  Networks,
  Operation,
  rpc,
  type Transaction,
} from '@stellar/stellar-sdk';

// Native XLM SAC address on Testnet (deterministic)
const NATIVE_SAC = Asset.native().contractId(Networks.TESTNET);

async function sendXlm(
  contractId: string,
  credentialId: string,
  recipient: string,
  amountXlm: number,
): Promise<string> {
  // Fund a fee-payer from Friendbot (Testnet only)
  const feePayer = Keypair.random();
  await server.requestAirdrop(feePayer.publicKey());

  const builder = await buildBaseTx(feePayer.publicKey());
  const amountStroops = BigInt(Math.round(amountXlm * 10_000_000));

  const raw = builder
    .addOperation(
      Operation.invokeContractFunction({
        contract: NATIVE_SAC,
        function: 'transfer',
        args: [
          new Address(contractId).toScVal(),   // from: smart wallet
          new Address(recipient).toScVal(),     // to: recipient
          nativeToScVal(amountStroops, { type: 'i128' }),
        ],
      }),
    )
    .build();

  const sim = await server.simulateTransaction(raw);
  if (!rpc.Api.isSimulationSuccess(sim)) throw new Error('Simulation failed');
  const assembled = rpc.assembleTransaction(raw, sim).build() as Transaction;

  // Passkey signs the SAC transfer authorization
  const signed = await signTransaction(assembled, credentialId, contractId);
  signed.sign(feePayer);

  const sent = await server.sendTransaction(signed);
  await server.pollTransaction(sent.hash);
  return sent.hash;
}
```

> **Contract must be funded first.** Call `server.requestAirdrop(contractId)` on Testnet or send XLM to the contract address via a regular payment before trying to transfer.

---

## Recovery Flow

When the user's passkey device is lost, the Ed25519 backup key is the only recovery path.

```typescript
import { signWithBackup } from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';

// User provides their backup secret key (stored in a password manager)
const backupKeypair = Keypair.fromSecret(userProvidedSecret);

// signWithBackup signs the Soroban auth entry with the Ed25519 key
const signed = await signWithBackup(assembled, backupKeypair, contractId);
signed.sign(feePayer);
// then submit as normal
```

**Important:** `signWithBackup` only works if `addBackupSigner` was called previously to register the key in the contract. If no backup key was registered, recovery requires a new contract deployment.

---

## Registering Multiple Passkeys

The contract stores a mapping of `credentialId → publicKey`. A user can register additional passkeys by calling `add_passkey` through the contract auth flow (requires an existing passkey to authorize). The SDK currently exposes `createWallet` (first passkey) and `addBackupSigner` (Ed25519 backup). Adding a second passkey to an existing wallet is possible by building an `add_passkey` invocation and signing it with `signTransaction`.

---

## stellar-wallets-kit Integration

```typescript
import { Networks as KitNetworks, StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { PASSKEY_MODULE_ID, PasskeyModule } from '@rohitaggarwal/wallets-kit-adapter';

// Initialise once at app startup
StellarWalletsKit.init({
  modules: [new PasskeyModule()],
  network: KitNetworks.TESTNET,
});
StellarWalletsKit.setWallet(PASSKEY_MODULE_ID);

// Get address (creates wallet if not connected)
const { address } = await StellarWalletsKit.fetchAddress();  // returns contractId

// Sign a pre-built, pre-simulated transaction
const { signedTxXdr, signerAddress } = await StellarWalletsKit.signTransaction(
  txXdr,
  { networkPassphrase: Networks.TESTNET },
);
// signedTxXdr has the Soroban auth entry set.
// You must still sign the outer envelope with the fee-payer before submitting.
```

### Fee-payer pattern when using the kit

```typescript
import { TransactionBuilder, Networks } from '@stellar/stellar-sdk';

const { signedTxXdr } = await StellarWalletsKit.signTransaction(txXdr, { ... });

// Parse the returned XDR back into a Transaction
const tx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
// Add fee-payer signature
tx.sign(myFeePayerKeypair);
// Now submit
```

---

## Web Components

### `<pk-register>`

Handles the full wallet creation flow in a single element.

```html
<pk-register name="My Wallet"></pk-register>
```

```javascript
document.addEventListener('pk-success', (e) => {
  const { contractId, credentialId } = e.detail;
  // save these
});
document.addEventListener('pk-error', (e) => {
  console.error(e.detail.message);
});
```

**Attributes:**
- `name` — display name used in the WebAuthn registration dialog

**Events emitted (bubble):**
- `pk-success` → `CustomEvent<{ contractId: string, credentialId: string }>`
- `pk-error` → `CustomEvent<{ message: string }>`

---

### `<pk-sign>`

Signs a pre-built transaction using the registered passkey.

```html
<pk-sign id="signer" credential-id="..." contract-id="C..."></pk-sign>
```

```javascript
const el = document.getElementById('signer');
el.transaction = assembledTx;  // Transaction object, already simulated

document.addEventListener('pk-signed', (e) => {
  const { xdr } = e.detail;  // XDR with auth entries set — still needs fee-payer + submit
});
```

**Attributes:**
- `credential-id` — the base64url passkey credential ID
- `contract-id` — the smart wallet contract address

**Properties:**
- `transaction: Transaction | null` — the assembled transaction to sign

**Events emitted (bubble):**
- `pk-signed` → `CustomEvent<{ xdr: string }>`
- `pk-error` → `CustomEvent<{ message: string }>`

---

### `<pk-recover>`

Signs a transaction using the Ed25519 backup key.

```html
<pk-recover id="recover" contract-id="C..."></pk-recover>
```

```javascript
document.getElementById('recover').transaction = assembledTx;

document.addEventListener('pk-recovered', (e) => {
  const { xdr } = e.detail;
});
```

**Attributes:**
- `contract-id` — the smart wallet contract address

**Properties:**
- `transaction: Transaction | null`

**Events emitted (bubble):**
- `pk-recovered` → `CustomEvent<{ xdr: string }>`
- `pk-error` → `CustomEvent<{ message: string }>`

The component renders a `<input type="password">` where the user pastes their backup secret key (S...).

---

## Credential Persistence

The POC stores `{ contractId, credentialId }` in `localStorage` under `'passkey-wallet-credential'`. This is fine for demos but has limitations:

| Concern | POC approach | Production recommendation |
|---|---|---|
| Multi-device | User must save contractId + credentialId themselves | Index credentials on-chain via Stellar contract events or Mercury/Zephyr |
| App reinstall | localStorage cleared → wallet access lost (unless user has backup key) | Store contractId derivable from the passkey assertion (lookup by credentialId in an indexer) |
| Multiple wallets | Only one credential stored | Support multiple entries per user |
| Credential discovery | Not supported | Use Mercury or Soroban events to enumerate passkeys by contract |

---

## Error Handling Reference

| Error | Cause | Handling |
|---|---|---|
| `NotAllowedError` from WebAuthn | User cancelled or timed out | Prompt to retry; do not treat as permanent failure |
| `InvalidStateError` from WebAuthn | Credential already registered | Ask user to sign in with existing passkey |
| `SecurityError` from WebAuthn | Wrong origin / rpId mismatch | Verify `window.location.hostname` matches the `id` used at registration |
| `No auth entry found for contract` | Transaction wasn't simulated or wrong contractId | Simulate the transaction before calling `signTransaction` |
| `Simulation failed` | RPC error or contract logic error | Check the simulation error JSON; most often a contract validation failure |
| `PasskeyModule: no credential found` | `getAddress()` not called before `signTransaction` in the kit adapter | Call `StellarWalletsKit.fetchAddress()` first |

---

## Known Issues

| Issue | Browsers | Workaround |
|---|---|---|
| Conditional UI not available | Firefox < 119 | Use modal prompt (default behavior) |
| WebAuthn blocked in cross-origin iframes | Safari | Add `allow="publickey-credentials-create *; publickey-credentials-get *"` to iframe |
| Platform authenticator returns ES384 instead of ES256 | Some Android devices | `pubKeyCredParams` includes both `-7` and `-35`; `@simplewebauthn/browser` negotiates |
| WebView blocks WebAuthn | Android WebView | Use Custom Tabs or Chrome for in-app browser |
| iCloud Keychain unavailable when iCloud signed out | iOS | Show a message guiding user to sign into iCloud |
| Cross-device passkey QR flow not available | Firefox | Offer backup key recovery instead |
| `rp.id` must match the current hostname | All | Do not use `localhost` passkeys on a deployed domain and vice versa |
| Auth entries expire after ~8 minutes | All | Set `latestLedger + 100` expiration; retry signing if the user takes too long |
| The Soroban contract is unaudited | — | This SDK is a POC. Do not use the reference contract in production. |

---

## Production Deployment Checklist

- [ ] HTTPS is required for WebAuthn — any plain HTTP origin will get `SecurityError`
- [ ] Set `rp.id` to the deployed domain, not `window.location.hostname` if you embed in iframes
- [ ] Replace Friendbot with a production relayer or fee-bump transaction service
- [ ] Replace localStorage credential storage with an indexer (Mercury/Zephyr or Soroban events)
- [ ] Audit the Soroban smart contract before mainnet deployment
- [ ] Test on real devices: macOS Safari, iOS Safari, Chrome Android, Windows Hello (Edge/Chrome)
- [ ] Add `<meta name="apple-mobile-web-app-capable" content="yes">` for iOS PWA installs (passkeys work in standalone mode from iOS 17)
