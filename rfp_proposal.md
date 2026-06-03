# SCF RFP Proposal: Passkey UI for Stellar Smart Accounts

## 1\. Problem Statement

Every Stellar wallet today requires users to manage a seed phrase or private key. This is the single biggest barrier to adoption for non-technical users:

- **Seed phrases are fragile.** Lose it, expose it, or mistype it, and the wallet is gone forever. There is no recovery.  
- **Browser extension wallets** (Freighter, Rabet, xBull) require a separate install step before a user can interact with any dApp. Most users abandon at this point.  
- **Hardware wallets** (Ledger, Trezor) add cost and friction that everyday users will not accept.  
- **Custodial alternatives** trade security for convenience, reintroducing the counterparty risk that blockchains exist to eliminate.

Passkeys solve this and many teams are trying to implement them on stellar. Already billions of users authenticate with passkeys created using Apple ID, and Google accounts to access their banks, storages and much more. They require no install, no seed phrase, and no new mental model. Stellar's Protocol 21 added native support for the cryptography passkeys that use the building blocks in place. What is missing is a **documented, reusable, production-quality SDK and UI layer** integrated with stellar-wallet-kit that Stellar wallet developers can actually ship.

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

`Need more input on how many signers and what people prefer`

### End-to-End Flow

**Registration (one-time setup):**

1. User visits a dApp and clicks "Create Wallet"  
2. Browser calls `navigator.credentials.create()` device shows biometric prompt  
3. Device generates a P-256 keypair in the secure enclave; returns the public key  
4. A Soroban smart contract is deployed (or a factory contract instantiates one) with the public key stored as an authorized signer  
5. The contract address becomes the user's wallet address
6. For fee payment a ed25519 wallet is also created which remains in the browser, it has minimum lumens to pay the gas fee and is refunded by the smart wallet upon transaction execution. \
`Need to get more input if this is good enough or fee relayer makes more sense`

**Signing a Transaction:**

1. User initiates an action (swap, transfer, contract call)  
2. The dApp constructs a Soroban transaction and sends a challenge to the browser  
3. Browser calls `navigator.credentials.get()` device shows biometric prompt  
4. Device signs the challenge; sdk returns the transaction with the fee wrapper from the ed25519 wallet. The wallet kit submits the transaction   
5. The Soroban contract calls `secp256r1_verify(),` if valid, the transaction executes

**Recovery:**

1. At registration time, a backup Ed25519 keypair is generated (stored by the user, e.g. exported as a file)  
2. If the passkey device is lost, the backup key can authorize a transaction that adds a new passkey  
3. No centralized recovery server is required the backup key is the recovery mechanism

### What Makes This Hard

The signing flow above is straightforward in theory. In practice, several things make it difficult:

- **Browser differences:** Safari, Chrome, and Firefox encode authenticator data differently. The SDK must normalize these before passing to the contract.  
- **Cross-device auth:** Passkeys synced via iCloud Keychain behave differently from hardware-bound passkeys; the contract should not make assumptions about AAGUID or counter values.  
- **No existing standard:** Unlike EIP-4337 on Ethereum, Stellar has no ecosystem-wide smart wallet interface standard yet. Each implementation today makes its own contract design choices.
- **fee architecture:** Fees can only be paid by EOA accounts, passkey can only generate signature autentication. One needs to implement fee wrapper on top of signature.
- **Integrating with wallet-kit**: This requires making the solution compatible with wallet-kit interface so that frontend implementation becomes easy for differents dApps.

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
- Operation without infrastructure. Several APIs require a live indexer service (`kit.rules.list()`, `kit.multiSigners.getAvailableSigners()`, contract discovery by credential ID). Without the indexer, these calls fail.
- Does not yet expose a stellar-wallets-kit compatible interface.

**Platform:** Browser (Chrome, Edge, Safari, Firefox with hardware key fallback). Node.js >=20. IndexedDB or localStorage required.

#### Layer 3: SwiftPasskeyKit (Soneso)

A Swift port of the passkey-kit pattern for iOS native apps. Active. Covers the iOS-native path that smart-account-kit does not.

---

### The Two Types of Passkeys

Before discussing compatibility, it is worth distinguishing the two kinds of passkeys a user can hold. This distinction drives most of the UX and recovery design decisions:

| Type | Stored where | Synced? | Notes |
| :---- | :---- | :---- | :---- |
| **Synced passkey** (discoverable / resident key) | iCloud Keychain / Google Password Manager | ✅ Yes | What most consumers will have. Works across devices on the same account. |
| **Device-bound passkey** | Hardware chip (Secure Enclave, TPM, YubiKey) | ❌ No | Security keys, some enterprise configs. Tied permanently to one device. |

Most consumer passkeys today are synced. This has a direct implication for Stellar wallets: a user's smart account is reachable from any of their Apple or Android devices without any manual key export, which is a meaningful UX improvement over seed phrases.

### Platform-by-Platform Behaviour

These findings come from direct implementation experience building passkey authentication on EVM (using Porto) and testing the same flows in preparation for the Stellar integration.

#### On iPhone (iOS)

- Created via `ASAuthorizationController` (native API, not WebAuthn)
- Private key is generated inside the **Secure Enclave** (hardware chip)
- Stored in **iCloud Keychain**
- Key material is **end-to-end encrypted** and synced to all Apple devices via iCloud's SOS (Secure Object Sync) protocol
- Biometric (Face ID / Touch ID) gates access to the key; it doesn't add another layer of encryption

#### On macOS Safari

- Same underlying system: Safari's WebAuthn API (`navigator.credentials.create()`) is backed by `ASAuthorizationController`
- Stored in **iCloud Keychain**
- Syncs automatically with iPhone if both are on the same Apple ID

#### On Android / Chrome

- Created via `CredentialManager` API (Android 14+) or the older FIDO2 API
- Stored in **Google Password Manager**
- Synced across Android devices on the same Google account

#### On Chrome (desktop, non-macOS)

- Uses the OS authenticator (Windows Hello on Windows, backed by TPM chip)
- Synced via **Google Password Manager** when signed into Chrome

#### On Firefox (any platform)

- Stored **locally only** - no sync mechanism
- Each Firefox device has a separate passkey; there is no cross-device access.

### Hardware Security Keys (Fallback)

For Firefox, Linux, and users who prefer device-bound credentials - FIDO2 hardware keys are a supported fallback:

| Key | Notes |
| :---- | :---- |
| YubiKey 5 series | Full FIDO2; USB-A/C \+ NFC |
| Google Titan | FIDO2; USB-C \+ NFC |
| Feitian ePass | Cost-effective FIDO2 option |

### Recommended Fallback Strategy

**Primary:** Synced platform passkey (biometric): Chrome, Safari, Edge on macOS / iOS / Android / Windows

**Fallback 1:** FIDO2 hardware security key: covers Firefox and Linux users

**Fallback 2:** Backup Ed25519 keypair: recovery path when all passkey devices are lost or inaccessible

## 5\. Implementation Plan

### Approach

The existing ecosystem has the hard parts solved at the protocol and contract level (OpenZeppelin stellar-contracts) and at the full-featured SDK level (smart-account-kit). What is missing is the minimal, approachable middle layer.

The approach is to extract the minimum viable slice from smart-account-kit, just the WebAuthn ceremony and Soroban signature payload construction and build on top of the already-deployed OpenZeppelin contracts rather than reinventing the on-chain layer. The result is a thin SDK with a narrow API, headless UI components where developers own the styling, and a first-class stellar-wallets-kit connector.

### Architecture

**`passkey-sdk:`** the core layer. Handles two things only:
1. WebAuthn ceremony: wraps `@simplewebauthn/browser` for registration and authentication, normalizes the encoding differences between Chrome, Safari, and Firefox

**`passkey-ui:`** headless Web Components. Each component handles state (loading, error, success) and emits typed events, but ships with no opinion on styling. Developers either use the default minimal style or replace it entirely via CSS custom properties and named slots.

**`wallets-kit-adapter:`** the connector. Implements the `stellar-wallets-kit` module interface: `getAddress()`, `signTransaction()`, `isAvailable()`. Uses `passkey-sdk` internally. The goal is a PR into the official `@creit-tech/stellar-wallets-kit` repo so passkeys appear as a native wallet option in the kit's modal UI alongside Freighter, Lobstr, and xBull.

### Stellar Wallets Kit - Prior Engagement and Specification Alignment

We have already opened discussions with the Creit Tech team (maintainers of `@creit-tech/stellar-wallets-kit`) to validate the adapter interface before implementation begins:

- **GitHub Issue #91** - [Stellar-Wallets-Kit/issues/91](https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/91): Raised to discuss adding a first-class passkey module to the kit, including the interface contract (`getAddress`, `signTransaction`, `isAvailable`) and how credential identity maps to wallet address derivation.
- **Stellar Developer Discord** - [Discussion thread](https://discord.com/channels/897514728459468821/1250851135561142423/1511354460251750562): Follow-up coordination in the Stellar developer community Discord confirming the approach and getting early feedback from the ecosystem.

The implementation will follow the `IStellarWalletsKit` module specification exactly, meaning any dApp already using `stellar-wallets-kit` can add passkey support by registering the adapter - no changes to their signing flow required. This is the core integration commitment of this proposal.

**`demo`:**  exercises the full flow end-to-end via the wallets-kit adapter: create smart wallet, register passkey, sign a Soroban transaction, recover via backup key. Serves as both a QA surface and a copy-paste reference.

### Key Technical Decisions

| Decision | Choice | Reason |
| :---- | :---- | :---- |
| On-chain contracts | OpenZeppelin stellar-contracts | Already deployed, partially audited, modular verifiers |
| WebAuthn library | `@simplewebauthn/browser` | Smallest proven abstraction; normalizes browser differences |
| UI approach | Headless Web Components | Framework-agnostic; developer owns styling |
| Fee module | To discuss | discuss the best approach for this |
| Test framework | Vitest | Fast; native ESM; TypeScript-native |

### Timeline

| Month | Focus | Deliverables |
| :---- | :---- | :---- |
| **Month 1** | Research and start building | `compatibility-matrix.md` and `usage-patterns.md` tested on real devices across browsers and OS combinations in Section 4 |
| **Month 2** | pr to stellar-wallet-kit | work with stellar-wallet-kit team to implement |
| **Month 3** | Testing | Talk to dapp teams to test out the solution |

---

## 6\. About the Team

**SmartCloud Solutions** ([smartcloudsolutions.tech](https://smartcloudsolutions.tech/)) is a three-person engineering team that builds production systems for blockchain protocols, agent infrastructure, and developer tooling with a focus on SDKs, Kubernetes-native platforms, and cross-chain protocol work.

### Rohit Aggarwal: Founder / CTO, Web3 Protocols

Rohit is the Founder/CTO of **Raga Finance** and **Nexus Network**. He previously led EVM development at **pSTAKE Finance**, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of **IIT Bombay** and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.

**Relevant to this project:** Protocol-level Ethereum and Cosmos experience, SDK design, smart contract architecture, and prior work building developer tooling for DeFi protocols.

### Anmol Yadav: Infrastructure \+ Agents Engineer

Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of **Starship**, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of **Constructive**. Previously tech lead at **Persistence Labs** and cloud platform engineer at Rakuten and Woven Planet.

**Relevant to this project:** Multi-chain devnet tooling, SDK maintenance, cross-ecosystem developer infrastructure, and experience shipping production tooling adopted by protocol teams.

### Arham Chordia: Senior Blockchain Developer

Arham is a Senior Blockchain Developer and alumnus of **IIT Jodhpur** (B.Tech Electrical Engineering). He has five years of experience shipping production blockchain infrastructure across multiple protocols spanning Cosmos, EVM, and Rust-based chains including SDK development from scratch, smart contract systems, and blockchain transaction pipelines. He will contribute across the full stack on this project.

## 7\. Milestone Breakdown

SCF Build Award is milestone-based with funding split across tranches tied to specific, verifiable deliverables.

| Milestone | Deliverable | Verification | Funding |
| :---- | :---- | :---- | :---- |
| **M1** Research Document | `docs/compatibility-matrix.md` and `docs/usage-patterns.md` published in the repo. Matrix covers all browser/OS/hardware combinations from Section 4, tested on real devices. | Reviewers can inspect the matrix, reproduce test cases, and verify coverage | Tranche 1 |
| **M2** Passkey SDK | package delivered and pr raised with stellar-wallet-kit | `npm install` \+ run tests; read API docs | Tranche 2 |
| **M3** Delivery | All docs finalized. Public blog post published summarizing passkey compatibility learnings. Compatibility matrix updated with any new findings. Full demo working on Testnet. | End-to-end demo walkthrough; blog post live |  |

