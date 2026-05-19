# PRD: Stellar Passkey UI

**RFP:** [SCF Build Award — Passkey UI Track](https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track#passkey-ui)  
**Status:** POC / Pre-submission  
**Goal:** Research, build, and document composable passkey authentication for Stellar smart accounts

---

## Problem Statement

Every Stellar team building passkey authentication rebuilds the same knowledge from scratch. The existing reference implementation (passkey-kit by kalepail) is monolithic, demo-quality, and marked legacy. There is no:

- Documented body of knowledge about what WebAuthn flows work reliably across browsers/devices
- Minimal, composable SDK that teams can actually depend on
- Reusable UI components for the standard passkey flows (register, sign, recover)
- Integration into `stellar-wallets-kit` as a first-class wallet type

---

## Research Findings

### Existing Implementation: passkey-kit (kalepail)
- Architecture: `PasskeyKit` (client), `PasskeyServer` (server), Soroban contracts (Rust), Mercury/Zephyr indexer
- Supports secp256r1 (passkey), Ed25519, and policy-based signing
- **Self-described as legacy/demo-only.** Not audited. Positioned as a precursor to OpenZeppelin Smart Accounts.
- Useful as an architecture reference — specifically the Soroban contract's `secp256r1_verify()` approach

### WebAuthn → Stellar Technical Flow
- Stellar natively uses Ed25519, but **Soroban provides secp256r1 host functions** for smart contract wallets
- A Soroban contract acts as the wallet: stores authorized P-256 public keys, verifies WebAuthn assertions
- Signature target: `sha256(authenticatorData || sha256(clientDataJSON))`
- Multiple signer types can be registered: passkeys, Ed25519 backup keys, spending-limit policies

### Browser/Device Compatibility (summary — full matrix in `docs/compatibility-matrix.md`)
| Platform | Create | Sign | Conditional UI | Cross-device sync |
|---|---|---|---|---|
| Chrome 67+ (desktop) | ✓ | ✓ | ✓ | Google Password Manager |
| Safari 13+ / macOS | ✓ | ✓ | ✓ | iCloud Keychain |
| iOS 14.5+ (Safari) | ✓ | ✓ | ✓ | iCloud Keychain |
| Android Chrome | ✓ | ✓ | ✓ | Google Password Manager |
| Firefox (desktop) | Partial | Partial | Firefox 119+ | Limited |
| Firefox (mobile) | Partial | Partial | No | No |
| IE / Opera Mini | ✗ | ✗ | ✗ | ✗ |

**Key gap:** Firefox is the only major browser with only partial WebAuthn support. All flows need graceful fallback to Ed25519 keypair signing when passkeys are unavailable.

### stellar-wallets-kit Integration Target
- `@creit-tech/stellar-wallets-kit` v2.2.0, actively maintained
- Wallet modules expose: `getAddress()`, `signTransaction()`, `isAvailable()`
- The passkey connector must follow this interface to be a first-class module

---

## Goals & Success Criteria

### Must Have (POC)
- [ ] End-to-end passkey registration → Stellar transaction signing works on Chrome and Safari
- [ ] SDK has a surface of ≤5 public methods
- [ ] UI components work without any JS framework (Web Components)
- [ ] stellar-wallets-kit adapter passes `getAddress()` and `signTransaction()` calls through to passkey SDK
- [ ] Demo app runs on Stellar Testnet with a real Soroban smart wallet contract

### Should Have (full submission)
- [ ] Compatibility matrix covering all major browsers + iOS/Android, published and linked
- [ ] Recovery flow: register a backup Ed25519 key at wallet creation time
- [ ] `browserCapabilities()` utility — tells the app what passkey features are available before showing UI
- [ ] Firefox fallback path documented and implemented in demo
- [ ] SDK published to npm under a scoped package

### Out of Scope (for POC)
- Production-audited Soroban contract
- Hardware security key (YubiKey) compatibility testing
- Server-side relayer / gas sponsorship (can use existing relayer services)
- Mobile native SDKs (iOS/Android)

---

## Architecture

### Package Layout
```
packages/
  passkey-sdk/           # Core logic, no UI, no framework
  passkey-ui/            # Web Components wrapping SDK
  wallets-kit-adapter/   # Thin connector for stellar-wallets-kit
apps/
  demo/                  # Integration demo on Testnet
docs/
  compatibility-matrix.md
  usage-patterns.md
contracts/
  passkey-wallet/        # Soroban contract (Rust)
```

### SDK Public API (target)
```typescript
// packages/passkey-sdk

// Check what's available in the current browser before showing any UI
browserCapabilities(): Promise<CapabilityReport>
// { webauthn: boolean, conditionalUI: boolean, platformAuthenticator: boolean }

// Register a new passkey and deploy a Soroban smart wallet on Testnet
createWallet(name: string): Promise<{ contractId: string, credentialId: string }>

// Sign a Stellar transaction using a previously registered passkey
signTransaction(tx: Transaction, credentialId: string): Promise<Transaction>

// Register an Ed25519 keypair as a backup signer on an existing wallet
addBackupSigner(contractId: string, keypair: Keypair): Promise<void>

// Sign a transaction using the backup Ed25519 keypair (recovery path)
signWithBackup(tx: Transaction, keypair: Keypair, contractId: string): Promise<Transaction>
```

### UI Components (Web Components)
```html
<pk-register name="My Wallet" on-success="handleSuccess" />
<pk-sign tx="base64EncodedXdr" credential-id="abc123" on-signed="handleSigned" />
<pk-recover contract-id="C..." on-recovered="handleRecovered" />
```

### stellar-wallets-kit Adapter
```typescript
// packages/wallets-kit-adapter
class PasskeyModule implements WalletModule {
  isAvailable(): Promise<boolean>
  getAddress(): Promise<string>           // returns contractId
  signTransaction(xdr: string): Promise<string>
}
```

---

## Implementation Phases

### Phase 1: Monorepo Scaffold
- [ ] Initialize pnpm workspace with `packages/`, `apps/`, `docs/`, `contracts/` structure
- [ ] Configure TypeScript (strict), ESLint, Vitest
- [ ] Set up `apps/demo` with Vite + vanilla TypeScript
- [ ] Add `@simplewebauthn/browser` and `@stellar/stellar-sdk` to passkey-sdk

### Phase 2: Soroban Contract (Reference)
- [ ] Port/adapt passkey-kit's Soroban contract to a clean, minimal version
- [ ] Contract stores: map of credentialId → P-256 public key
- [ ] Contract method: `verify_and_exec(auth_entry, authenticator_data, client_data_json, sig)`
- [ ] Deploy to Testnet, record contract ID for demo

### Phase 3: Core SDK (`packages/passkey-sdk`)
- [ ] Implement `browserCapabilities()`
- [ ] Implement `createWallet(name)` — calls `startRegistration()`, deploys contract, returns contractId + credentialId
- [ ] Implement `signTransaction(tx, credentialId)` — calls `startAuthentication()`, builds Soroban auth entry, returns signed tx
- [ ] Implement `addBackupSigner()` and `signWithBackup()` (recovery path)
- [ ] Unit tests with Vitest (mock WebAuthn calls)

### Phase 4: UI Components (`packages/passkey-ui`)
- [ ] `<pk-register>` — handles create flow, emits success/error events
- [ ] `<pk-sign>` — handles sign flow with passkey prompt
- [ ] `<pk-recover>` — backup keypair recovery flow
- [ ] All components handle loading, error, and unsupported-browser states
- [ ] Test in Chrome + Safari manually

### Phase 5: stellar-wallets-kit Adapter (`packages/wallets-kit-adapter`)
- [ ] Implement `PasskeyModule` satisfying the kit's wallet connector interface
- [ ] Wire `getAddress()` → `createWallet()` or restore from localStorage
- [ ] Wire `signTransaction()` → `signTransaction()` from SDK
- [ ] Test with a minimal stellar-wallets-kit integration in the demo app

### Phase 6: Demo App (`apps/demo`)
- [ ] Full flow: connect wallet (via wallets-kit) → check balance → send payment → signed with passkey
- [ ] Show `browserCapabilities()` banner — warn on unsupported browsers
- [ ] Show recovery flow: register backup key → use it when passkey is unavailable
- [ ] Deploy to Vercel/Netlify for live testing

### Phase 7: Documentation
- [ ] `docs/compatibility-matrix.md` — full tested matrix across Chrome, Safari, Firefox (desktop + mobile)
- [ ] `docs/usage-patterns.md` — known issues, recommended fallbacks, integration walkthrough
- [ ] README for each package with quick-start example
- [ ] API docs generated from TypeScript types

---

## Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Soroban contract complexity (secp256r1 verification) | Start from passkey-kit's existing contract, adapt rather than rewrite |
| Firefox partial support | Detect with `browserCapabilities()` and degrade gracefully to Ed25519 flow |
| stellar-wallets-kit interface changes | Pin to v2.2.0 for POC; note integration was tested against this version |
| WebAuthn challenge/replay handling | Use server-generated challenges even in demo; never reuse challenges |
| Passkey loss (user loses device) | Mandate backup Ed25519 key registration at wallet creation time |

---

## Open Questions

1. **Contract deployment cost:** Who pays the Testnet XLM for contract deployment during `createWallet()`? Options: demo-mode faucet, user-funded, or a relayer. For POC: faucet + Friendbot.
2. **Credential storage:** Where is `credentialId → contractId` mapping stored client-side? Options: localStorage, the Soroban contract itself (via event indexing), or Mercury. For POC: localStorage with a clear note about production requirements.
3. **stellar-wallets-kit maintainer coordination:** The RFP requires prior conversation with maintainers before submission. Need to open a GitHub issue/discussion on Creit-Tech/stellar-wallets-kit before final submission.
4. **Framework for UI components:** Web Components chosen for POC. If the ecosystem strongly prefers React, reconsider after community feedback.
