# SCF RFP Proposal: Passkey UI for Stellar Smart Accounts

## 1\. Problem Statement

Every Stellar wallet today requires users to manage a seed phrase or private key. This is the single biggest barrier to adoption for non-technical users:

- **Seed phrases are fragile.** Lose it, expose it, or mistype it, and the wallet is gone forever. There is no recovery.  
- **Browser extension wallets** (Freighter, Rabet, xBull) require a separate install step before a user can interact with any dApp. Most users abandon at this point.  
- **Hardware wallets** (Ledger, Trezor) add cost and friction that everyday users will not accept.  
- **Custodial alternatives** trade security for convenience, reintroducing the counterparty risk that blockchains exist to eliminate.

Passkeys solve this and many teams are trying to solve this. They are already how billions of users authenticate with their banks, Apple ID, and Google accounts. They require no install, no seed phrase, and no new mental model. Stellar's Protocol 21 added native support for the cryptography passkeys that use the building blocks in place. What is missing is a **documented, reusable, production-quality SDK and UI layer** integrated with stellar-wallet-kit that Stellar wallet developers can actually ship.

This proposal delivers that layer.

## 2\. What Are Passkeys and How They Work

### Background

Passkeys are a W3C/FIDO2 standard (WebAuthn) that replace passwords and seed phrases with cryptographic keys stored securely on a user's device, protected by biometrics (Face ID, Touch ID, fingerprint) or device PIN. They were designed by Apple, Google, and Microsoft under the FIDO Alliance, and are now supported natively on every major OS and browser.

Unlike passwords, passkeys are:

- **Phishing-resistant**: cryptographically bound to the origin (domain) they were created on; a fake site cannot trick the device into signing  
- **Non-exportable**: the private key is stored in the device's secure enclave and never leaves it  
- **Cross-device sync-capable**: via iCloud Keychain (Apple devices) or Google Password Manager (Android/Chrome)  
- **Already familiar**: users already use biometrics to unlock their phone, banking app, and laptop

### The Cryptography

Passkeys use **P-256 (secp256r1)** elliptic curve cryptography, the same curve used by TLS certificates and hardware security keys. When a user registers a passkey:

1. The device generates a P-256 key pair inside the secure enclave  
2. The **public key** is returned to the application and stored server-side (or in our case, in a smart contract)  
3. The **private key** never leaves the device

When a user signs with their passkey:

1. The browser calls `navigator.credentials.get()`: the device shows a biometric prompt  
2. The device signs a challenge with the private key  
3. The browser returns `(authenticatorData, clientDataJSON, signature):` a WebAuthn assertion  
4. The application verifies the signature against the stored public key

### Why This Matters for Wallets

Traditional blockchain wallets require users to understand and protect a private key directly. Passkeys move the key into the OS security layer, the same layer that protects Apple Pay, Windows Hello, and Android Keystore. The user interacts only with a familiar biometric prompt. The private key management complexity disappears entirely.

## 3\. Passkeys on Stellar and How They Work

### Protocol 21 and secp256r1

Stellar's Protocol 21 (live on Mainnet) introduced native secp256r1 signature verification inside Soroban smart contracts (CAP-0051). This is the technical foundation that makes passkey wallets possible on Stellar. Before Protocol 21, Stellar only supported Ed25519 signatures incompatible with the P-256 curve that passkeys use.

With Protocol 21, a passkey can directly authorize a Soroban transaction with no bridging, no wrapping, and no trusted intermediary.

### Smart Wallet Architecture

On Stellar, a passkey wallet is a **Soroban smart contract**, not a key pair. The user's "wallet address" is the contract address. The contract maintains a list of authorized signers, and one of those signers is a passkey (a P-256 public key).

User's Wallet \= Soroban Smart Contract

  └── Signer 1: Passkey (P-256 public key from device)

  └── Signer 2: Backup Ed25519 keypair (recovery)

  └── Signer N: Additional passkeys, session keys, policies...

### End-to-End Flow

**Registration (one-time setup):**

1. User visits a dApp and clicks "Create Wallet"  
2. Browser calls `navigator.credentials.create()` device shows biometric prompt  
3. Device generates a P-256 keypair in the secure enclave; returns the public key  
4. A Soroban smart contract is deployed (or a factory contract instantiates one) with the public key stored as an authorized signer  
5. The contract address becomes the user's wallet address

**Signing a Transaction:**

1. User initiates an action (swap, transfer, contract call)  
2. The dApp constructs a Soroban transaction and sends a challenge to the browser  
3. Browser calls `navigator.credentials.get()` device shows biometric prompt  
4. Device signs the challenge; browser returns `(authenticatorData, clientDataJSON, sig)`  
5. The dApp submits the transaction with the WebAuthn assertion as the authorization  
6. The Soroban contract calls `secp256r1_verify(),` if valid, the transaction executes

**Recovery:**

1. At registration time, a backup Ed25519 keypair is generated (stored by the user, e.g. exported as a file)  
2. If the passkey device is lost, the backup key can authorize a transaction that adds a new passkey  
3. No centralized recovery server is required the backup key is the recovery mechanism

### What Makes This Hard

The signing flow above is straightforward in theory. In practice, several things make it difficult:

- **Challenge construction:** The Soroban contract must verify not just the signature but the shape of `clientDataJSON` (which includes the challenge, origin, and type field). Getting this wrong silently fails.  
- **Browser differences:** Safari, Chrome, and Firefox encode authenticator data differently. The SDK must normalize these before passing to the contract.  
- **Cross-device auth:** Passkeys synced via iCloud Keychain behave differently from hardware-bound passkeys; the contract should not make assumptions about AAGUID or counter values.  
- **No existing standard:** Unlike EIP-4337 on Ethereum, Stellar has no ecosystem-wide smart wallet interface standard yet. Each implementation today makes its own contract design choices.

## 4\. Existing Passkey SDKs and Platform Compatibility

### Existing Implementations on Stellar

There are three layers to understand: the on-chain contracts, the TypeScript SDK that wraps them, and an older cross-platform demo that showed the mobile path.

#### Layer 1: OpenZeppelin stellar-contracts (on-chain, Rust)

The foundation. OpenZeppelin's `stellar-contracts` repo provides the Soroban smart account contracts that everything above builds on:

- **smart_account**: core context rule management and the `do_check_auth` authorization flow
- **verifiers**: stateless contracts for ed25519 and WebAuthn (secp256r1/P-256) signature verification
- **policies**: threshold multisig, weighted threshold, and spending-limit enforcement contracts

These are modular and reusable across smart accounts. The verifier contracts are stateless, meaning multiple smart accounts can share a single deployed verifier. Status: experimental but partially audited. Requires Protocol 21+ for secp256r1, benefits from Protocol 23 for cheaper cross-contract calls.

**Platform:** On-chain only. No client-side component.

#### Layer 2: smart-account-kit (TypeScript SDK)

The current reference TypeScript SDK, built by kalepail, that wraps the OpenZeppelin contracts above. It handles wallet deployment, signer management, session persistence, and transaction signing.

**What it does well:**
- Full wallet lifecycle: `createWallet()`, `connectWallet()`, `disconnect()`
- All signer types: passkeys (secp256r1), Ed25519, delegated G-addresses
- Context rules and policies: threshold multisig, spending limits, weighted voting
- Storage adapters: IndexedDB (recommended), localStorage, custom
- Multi-signer flows and external wallet adapters (including a `StellarWalletsKitAdapter`)
- Fee sponsoring via optional relayer proxy

**What it does NOT provide:**
- Any UI components. The application is entirely responsible for the interface.
- Mobile support. It is web-only (browser WebAuthn API).
- Operation without infrastructure. Several APIs require a live indexer service (`kit.rules.list()`, `kit.multiSigners.getAvailableSigners()`, contract discovery by credential ID). Without the indexer, these calls fail.
- A minimal integration path. The API surface is large (8 sub-managers, 30+ methods) and requires pre-deployed contracts to be configured upfront via environment variables.

**Platform:** Browser (Chrome, Edge, Safari, Firefox with hardware key fallback). Node.js >=20. IndexedDB or localStorage required.

#### Layer 3: soroban-passkey (archived cross-platform demo)

An earlier demo by kalepail, now archived. Its value is in showing the mobile-native approach: it implemented WebAuthn using Svelte for web, native Swift (iOS), and native Java (Android), bundled via Capacitor. It proved the flow works on iOS (Face ID via `ASAuthorizationController`) and Android (fingerprint via `CredentialManager`). Superseded by smart-account-kit for web, but the mobile patterns remain the reference for native app integration.

**Platform:** Web (Svelte), iOS (Swift/UIKit), Android (Java).

#### Layer 4: SwiftPasskeyKit (Soneso)

A Swift port of the passkey-kit pattern for iOS native apps. Active. Covers the iOS-native path that smart-account-kit does not.

---

### What Is Missing

Mapping the existing solutions against what developers actually need reveals three clear gaps:

| Need | smart-account-kit | This Proposal |
| :---- | :---- | :---- |
| Minimal integration (no indexer required) | No — indexer needed for many APIs | Yes — core flows work without indexer |
| UI components for register / sign / recover | No — application responsibility | Yes — headless components, developer-styled |
| stellar-wallets-kit first-class connector | Partial — adapter exists but not in the official kit | Yes — PR into @creit-tech/stellar-wallets-kit |
| Documented compatibility matrix | No | Yes — primary deliverable |
| Mobile web guidance (in-app WebView caveats) | Not documented | Yes |

The goal is not to replace smart-account-kit. It is to extract the minimal viable slice needed for a developer to add passkey auth to a dApp in an afternoon, without setting up indexer infrastructure, without writing their own UI, and with passkeys appearing as a native option in stellar-wallets-kit.

### Platform Compatibility Matrix

#### Browsers (Desktop)

| Browser | Passkey Support | Platform Authenticator | Credential Sync | Conditional UI | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Chrome 106+** | ✅ Full | ✅ Yes | ✅ Google Password Manager | ✅ Yes | Recommended primary target; best developer tooling |
| **Edge 106+** | ✅ Full | ✅ Yes | ✅ Windows Hello / Microsoft | ✅ Yes | Chromium-based; identical to Chrome |
| **Safari 16+** | ✅ Full | ✅ Yes | ✅ iCloud Keychain | ✅ Yes | Required path for iOS; best Apple ecosystem experience |
| **Firefox 122+** | ⚠️ Partial | ❌ No | ❌ No | ✅ Yes (v122+) | WebAuthn works with external security keys; no biometric platform authenticator, no passkey sync |
| **Brave** | ✅ Full | ✅ Yes | ✅ Via OS | ✅ Yes | Chromium-based; works identically to Chrome |
| **Samsung Internet** | ✅ Full | ✅ Yes | ✅ Google Password Manager | ✅ Yes | Covers large Android user base |

**Firefox caveat:** Firefox supports the WebAuthn protocol but does not provide a built-in platform authenticator. Users on Firefox cannot create or use a biometric passkey. The fallback path is a FIDO2 hardware security key (YubiKey, Titan). This should be communicated clearly in the UI.

#### Operating Systems / Mobile

| Platform | Support | Authenticator | Notes |
| :---- | :---- | :---- | :---- |
| **macOS 13+ (Ventura)** | ✅ Full | Touch ID / iCloud Keychain | Syncs across all Apple devices on the same iCloud account |
| **iOS 16+** | ✅ Full | Face ID / Touch ID | Smoothest mobile experience; iCloud Keychain sync |
| **Android 9+ (Chrome)** | ✅ Full | Fingerprint / face unlock | Requires Google Play Services for credential sync |
| **Windows 10/11** | ✅ Full | Windows Hello (PIN, face, fingerprint) | Works on Edge and Chrome |
| **Android (no Play Services)** | ❌ Broken |  | Passkey registration/auth fail; affects de-Googled Android and some regions |
| **Linux (desktop)** | ⚠️ Partial | Hardware keys only | No platform authenticator; YubiKey works via Chrome/Firefox |

#### Hardware Security Keys (Fallback)

For users on Firefox, Linux, or without biometrics — FIDO2 hardware keys serve as authenticators:

| Key | Notes |
| :---- | :---- |
| YubiKey 5 series | Full FIDO2; USB-A/C \+ NFC |
| Google Titan | FIDO2; USB-C \+ NFC |
| Feitian ePass | Cost-effective FIDO2 option |

#### Recommended Fallback Strategy

Primary: Platform passkey (biometric) Chrome, Safari, Edge on macOS / iOS / Android / Windows

Fallback 1: Hardware security key (FIDO2) covers Firefox and Linux users

Fallback 2: Backup Ed25519 keypair recovery path when passkey device is lost

## 5\. Implementation Plan

### Approach

The existing ecosystem has the hard parts solved at the protocol and contract level (OpenZeppelin stellar-contracts) and at the full-featured SDK level (smart-account-kit). What is missing is the minimal, approachable middle layer.

The approach is to extract the minimum viable slice from smart-account-kit — just the WebAuthn ceremony and Soroban signature payload construction — and build on top of the already-deployed OpenZeppelin contracts rather than reinventing the on-chain layer. The result is a thin SDK with a narrow API, headless UI components where developers own the styling, and a first-class stellar-wallets-kit connector.

**What we build on top of (do not reinvent):**
- OpenZeppelin stellar-contracts: smart account contract, WebAuthn verifier, Ed25519 verifier, policy contracts. These are already deployed on testnet.
- `@simplewebauthn/browser`: WebAuthn ceremony normalization across browsers. Already battle-tested.

**What we build:**
- The TypeScript glue between `@simplewebauthn/browser` outputs and Soroban-formatted auth entries
- Headless UI components for the three flows (register, sign, recover) with slots for developer-controlled styling
- The stellar-wallets-kit connector module

### Package Architecture

```
packages/
  passkey-sdk/          # WebAuthn ceremonies + Soroban signature formatting
  passkey-ui/           # Headless UI components (Web Components)
  wallets-kit-adapter/  # stellar-wallets-kit connector
apps/
  demo/                 # End-to-end demo (Vite + TypeScript)
docs/
  compatibility-matrix.md
  usage-patterns.md
```

**`passkey-sdk`** — the core layer. Handles two things only:
1. WebAuthn ceremony: wraps `@simplewebauthn/browser` for registration and authentication, normalizes the encoding differences between Chrome, Safari, and Firefox
2. Soroban payload: takes a WebAuthn assertion `(authenticatorData, clientDataJSON, sig)` and formats it into the `WebAuthnSigData` struct that the OpenZeppelin verifier contract expects

It does not deploy contracts, manage sessions, or talk to an indexer. Those concerns belong to the application or to smart-account-kit for teams that need them.

**`passkey-ui`** — headless Web Components. Each component handles state (loading, error, success) and emits typed events, but ships with no opinion on styling. Developers either use the default minimal style or replace it entirely via CSS custom properties and named slots. Framework-agnostic: works inside React, Vue, Svelte, and vanilla HTML without wrappers.

Three components:
- `<passkey-register>`: registration flow, browser compatibility check, fallback messaging for Firefox
- `<passkey-sign>`: signing prompt with biometric trigger and loading state
- `<passkey-recover>`: backup Ed25519 key recovery flow

**`wallets-kit-adapter`** — the connector. Implements the `stellar-wallets-kit` module interface: `getAddress()`, `signTransaction()`, `isAvailable()`. Uses `passkey-sdk` internally. The goal is a PR into the official `@creit-tech/stellar-wallets-kit` repo so passkeys appear as a native wallet option in the kit's modal UI alongside Freighter, Lobstr, and xBull.

**`demo`** — exercises the full flow end-to-end via the wallets-kit adapter: create smart wallet, register passkey, sign a Soroban transaction, recover via backup key. Serves as both a QA surface and a copy-paste reference.

### Key Technical Decisions

| Decision | Choice | Reason |
| :---- | :---- | :---- |
| On-chain contracts | OpenZeppelin stellar-contracts | Already deployed, partially audited, modular verifiers |
| WebAuthn library | `@simplewebauthn/browser` | Smallest proven abstraction; normalizes browser differences |
| UI approach | Headless Web Components | Framework-agnostic; developer owns styling |
| Stellar SDK | `@stellar/stellar-sdk` | Required for Soroban transaction construction |
| No indexer dependency | Core flows only | Indexer needed for contract discovery; out of scope for minimal SDK |
| Test framework | Vitest | Fast; native ESM; TypeScript-native |

### Timeline

| Month | Focus | Deliverables |
| :---- | :---- | :---- |
| **Month 1** | Research and compatibility docs | `compatibility-matrix.md` and `usage-patterns.md` tested on real devices across browsers and OS combinations in Section 4 |
| **Month 2** | Core SDK | `packages/passkey-sdk`: WebAuthn ceremony wrappers, Soroban payload formatter, full Vitest suite |
| **Month 3** | Headless UI components | `packages/passkey-ui`: register, sign, recover Web Components with fallback messaging and typed events |
| **Month 4** | Wallets Kit adapter | `packages/wallets-kit-adapter` + coordination with @creit-tech, PR opened into official repo |
| **Month 5** | Hardening and delivery | Final docs, end-to-end demo on testnet, public blog post on passkey compatibility findings |

---

## 6\. About the Team

**SmartCloud** is a two-engineer studio that builds production systems for agent and infrastructure teams, with a focus on agent workflows, Kubernetes platforms, protocol tooling, and SDKs.

### Rohit Aggarwal: Founder / CTO, Web3 Protocols

Rohit is the Founder/CTO of **Raga Finance** and **Nexus Network**. He previously led EVM development at **pSTAKE Finance**, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of **IIT Bombay** and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.

**Relevant to this project:** Protocol-level Ethereum and Cosmos experience, SDK design, smart contract architecture, and prior work building developer tooling for DeFi protocols.

### Anmol Yadav: Infrastructure \+ Agents Engineer

Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of **Starship**, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem  and co-founder of **Constructive**. Previously tech lead at **Persistence Labs** and cloud platform engineer at Rakuten and Woven Planet.

**Relevant to this project:** Multi-chain devnet tooling, SDK maintenance, cross-ecosystem developer infrastructure, and experience shipping production tooling adopted by protocol teams.

## 7\. Milestone Breakdown

SCF Build Award is milestone-based with funding split across tranches tied to specific, verifiable deliverables.

| Milestone | Deliverable | Verification | Funding |
| :---- | :---- | :---- | :---- |
| **M1** Compatibility Research | `docs/compatibility-matrix.md` and `docs/usage-patterns.md` published in the repo. Matrix covers all browser/OS/hardware combinations from Section 4, tested on real devices. | Reviewers can inspect the matrix, reproduce test cases, and verify coverage | Tranche 1 |
| **M2** Passkey SDK | `packages/passkey-sdk` published with `startRegistration()`, `startAuthentication()`, `buildSignaturePayload()`. Vitest suite passing. API docs complete. | `npm install` \+ run tests; read API docs | Tranche 2 |
| **M3** UI Components | `packages/passkey-ui` Web Components for register, sign, and recover flows. Works in vanilla HTML, React, and Vue. Browser fallback messaging for Firefox and unsupported platforms. | Load demo app; test each flow in Chrome, Safari, Firefox | Tranche 3 |
| **M4** Wallets Kit Adapter | `packages/wallets-kit-adapter` implementing the `stellar-wallets-kit` connector interface. PR opened (and ideally merged) into the official `@creit-tech/stellar-wallets-kit` repo. | Review the PR; run the demo app end-to-end through the kit | Tranche 4 |
| **M5** Delivery | All docs finalized. Public blog post published summarizing passkey compatibility learnings. Compatibility matrix updated with any new findings. Full demo working on Testnet. | End-to-end demo walkthrough; blog post live |  |

