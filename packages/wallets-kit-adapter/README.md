# @rohitaggarwal/wallets-kit-adapter

A `@creit.tech/stellar-wallets-kit` v2 connector that adds passkey-based smart wallets as a first-class wallet type.

## Install

```bash
npm install @rohitaggarwal/wallets-kit-adapter @rohitaggarwal/passkey-sdk @stellar/stellar-sdk @creit.tech/stellar-wallets-kit
```

## Quick Start

```typescript
import { Networks as KitNetworks, StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { PASSKEY_MODULE_ID, PasskeyModule } from '@rohitaggarwal/wallets-kit-adapter';

// Initialize once at app startup
StellarWalletsKit.init({
  modules: [new PasskeyModule()],
  network: KitNetworks.TESTNET,
});
StellarWalletsKit.setWallet(PASSKEY_MODULE_ID);

// Get the smart wallet contract address (creates a new wallet if none exists)
const { address } = await StellarWalletsKit.fetchAddress();
// address is the Soroban contract address (C...)

// Sign a pre-built, pre-simulated transaction
const { signedTxXdr } = await StellarWalletsKit.signTransaction(txXdr, {
  networkPassphrase: Networks.TESTNET,
});

// IMPORTANT: signedTxXdr has the Soroban auth entry signed but the outer
// envelope is unsigned. You must sign it with the fee-payer before submitting:
import { TransactionBuilder, Networks } from '@stellar/stellar-sdk';

const tx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
tx.sign(myFeePayerKeypair);
await server.sendTransaction(tx);
```

## API

### `PasskeyModule`

Implements `ModuleInterface` from `@creit.tech/stellar-wallets-kit`.

| Method | Behavior |
|---|---|
| `isAvailable()` | Returns `true` if the browser has WebAuthn + a platform authenticator (Touch ID, Windows Hello, etc.) |
| `getAddress()` | Returns the contract address from localStorage, or calls `createWallet()` to register a new passkey and deploy a contract |
| `signTransaction(xdr, opts?)` | Signs the Soroban authorization entry with the registered passkey. **Does not sign the outer envelope.** |
| `signAuthEntry()` | Throws — not supported in v0.1; use `signTransaction` instead |
| `signMessage()` | Throws — not supported |
| `getNetwork()` | Returns `{ network: 'TESTNET', networkPassphrase: 'Test SDF Network ; September 2015' }` |
| `disconnect()` | Removes the stored credential from localStorage |

### `PASSKEY_MODULE_ID`

```typescript
export const PASSKEY_MODULE_ID = 'passkey';
```

Use this constant with `StellarWalletsKit.setWallet(PASSKEY_MODULE_ID)` to avoid magic strings.

---

## The Fee-Payer Pattern

`signTransaction` only handles the **Soroban authorization layer** — it signs the auth entry that proves the smart wallet consents to the operation. The outer Stellar transaction envelope (which pays the network fee) is a separate concern and must be signed by the fee-paying account:

```typescript
// 1. Build and simulate the transaction (fee-payer is the source account)
const builder = await buildBaseTx(feePayer.publicKey());
const raw = builder.addOperation(/* ... */).build();

const sim = await server.simulateTransaction(raw);
const assembled = rpc.assembleTransaction(raw, sim).build();

// 2. Kit signs the Soroban auth entry (passkey ceremony)
const { signedTxXdr } = await StellarWalletsKit.signTransaction(
  assembled.toXDR(),
  { networkPassphrase: Networks.TESTNET },
);

// 3. Fee-payer signs the outer envelope
const tx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
tx.sign(feePayer);

// 4. Submit
await server.sendTransaction(tx);
```

---

## Credential Storage

The module stores `{ contractId, credentialId }` in `localStorage` under the key `passkey-wallet-credential`. This is suitable for demos and single-device apps. For production:

- Use a Mercury or Zephyr indexer to look up contract addresses by passkey credential assertion
- Support multiple credentials per user (multiple devices or multiple wallets)
- Handle the case where localStorage is cleared (user can still recover via backup key if registered)

---

## Limitations (v0.1)

- **Testnet only** — `getAddress()` uses Friendbot for contract deployment; production requires a relayer
- **signAuthEntry not supported** — the full authorization flow requires simulation context that individual auth entries don't carry; use `signTransaction` with a fully assembled transaction
- **signMessage not supported** — passkey-based smart wallets don't have a general message-signing primitive
- The underlying reference contract is unaudited — do not use in production

---

## Types

```typescript
interface ModuleInterface {
  readonly moduleType: ModuleType;
  readonly productId: string;
  readonly productName: string;
  readonly productUrl: string;
  readonly productIcon: string;
  isAvailable(): Promise<boolean>;
  getAddress(params?: { path?: string; skipRequestAccess?: boolean }): Promise<{ address: string }>;
  signTransaction(xdr: string, opts?: { networkPassphrase?: string; address?: string; path?: string }): Promise<{ signedTxXdr: string; signerAddress?: string }>;
  signAuthEntry(authEntry: string, opts?: { networkPassphrase?: string; address?: string; path?: string }): Promise<{ signedAuthEntry: string; signerAddress?: string }>;
  signMessage(message: string, opts?: { networkPassphrase?: string; address?: string; path?: string }): Promise<{ signedMessage: string; signerAddress?: string }>;
  getNetwork(): Promise<{ network: string; networkPassphrase: string }>;
  disconnect(): Promise<void>;
}
```
