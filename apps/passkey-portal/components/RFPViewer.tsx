'use client'

const RFP_HTML = `
<h1>SCF RFP Proposal: Passkey UI for Stellar Smart Accounts</h1>

<h2>1. Problem Statement</h2>
<p>Every Stellar wallet today requires users to manage a seed phrase or private key. This is the single biggest barrier to adoption for non-technical users:</p>
<ul>
  <li><strong>Seed phrases are fragile.</strong> Lose it, expose it, or mistype it, and the wallet is gone forever. There is no recovery.</li>
  <li><strong>Browser extension wallets</strong> (Freighter, Rabet, xBull) require a separate install step before a user can interact with any dApp. Most users abandon at this point.</li>
  <li><strong>Hardware wallets</strong> (Ledger, Trezor) add cost and friction that everyday users will not accept.</li>
  <li><strong>Custodial alternatives</strong> trade security for convenience, reintroducing the counterparty risk that blockchains exist to eliminate.</li>
</ul>
<p>Passkeys solve this and many teams are trying to implement them on Stellar. Already billions of users authenticate with passkeys created using Apple ID and Google accounts to access their banks, storage, and much more. They require no install, no seed phrase, and no new mental model. Stellar's Protocol 21 added native support for the cryptography passkeys use. What is missing is a <strong>documented, reusable, production-quality SDK and UI layer</strong> integrated with stellar-wallet-kit that Stellar wallet developers can actually ship.</p>
<p>This proposal delivers that layer.</p>

<h2>2. What Are Passkeys and How They Work</h2>
<h3>Background</h3>
<p>Passkeys are a W3C/FIDO2 standard (WebAuthn) that replace passwords and seed phrases with cryptographic keys stored securely on a user's device, protected by biometrics (Face ID, Touch ID, fingerprint) or device PIN. They were designed by Apple, Google, and Microsoft under the FIDO Alliance, and are now supported natively on every major OS and browser.</p>
<p>Unlike passwords, passkeys are:</p>
<ul>
  <li><strong>Phishing-resistant</strong>: cryptographically bound to the origin (domain) they were created on; a fake site cannot trick the device into signing</li>
  <li><strong>Non-exportable</strong>: the private key is stored in the device's secure enclave and never leaves it</li>
  <li><strong>Cross-device sync-capable</strong>: via iCloud Keychain (Apple devices) or Google Password Manager (Android/Chrome)</li>
  <li><strong>Already familiar</strong>: users already use biometrics to unlock their phone, banking app, and laptop</li>
</ul>

<h3>The Cryptography</h3>
<p>Passkeys use <strong>P-256 (secp256r1)</strong> elliptic curve cryptography. When a user registers a passkey:</p>
<ol>
  <li>The device generates a P-256 key pair inside the secure enclave</li>
  <li>The <strong>public key</strong> is returned to the application and stored in the smart contract</li>
  <li>The <strong>private key</strong> never leaves the device</li>
</ol>

<h3>Why This Matters for Wallets</h3>
<p>Traditional blockchain wallets require users to understand and protect a private key directly. Passkeys move the key into the OS security layer, the same layer that protects Apple Pay, Windows Hello, and Android Keystore. The user interacts only with a familiar biometric prompt.</p>

<h2>3. Passkeys on Stellar</h2>
<h3>Protocol 21 and secp256r1</h3>
<p>Stellar's Protocol 21 (live on Mainnet) introduced native secp256r1 signature verification inside Soroban smart contracts (CAP-0051). With Protocol 21, a passkey can directly authorize a Soroban transaction with no bridging, no wrapping, and no trusted intermediary.</p>

<h3>Smart Wallet Architecture</h3>
<p>On Stellar, a passkey wallet is a <strong>Soroban smart contract</strong>, not a key pair. The contract maintains a list of authorized signers, and one of those signers is a passkey (a P-256 public key).</p>
<pre><code>User's Wallet = Soroban Smart Contract
  └── Signer 1: Passkey (P-256 public key from device)
  └── Signer 2: Backup Ed25519 keypair (recovery)
  └── Signer N: Additional passkeys, session keys, policies...</code></pre>

<h2>4. Existing Passkey SDKs and Platform Compatibility</h2>

<h3>The Two Types of Passkeys</h3>
<p>Before discussing compatibility, it is worth distinguishing the two kinds of passkeys a user can hold. This distinction drives most of the UX and recovery design decisions:</p>
<table>
  <thead>
    <tr><th>Type</th><th>Stored where</th><th>Synced?</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Synced passkey</strong> (discoverable / resident key)</td><td>iCloud Keychain / Google Password Manager</td><td>✅ Yes</td><td>What most consumers will have. Works across devices on the same account.</td></tr>
    <tr><td><strong>Device-bound passkey</strong></td><td>Hardware chip (Secure Enclave, TPM, YubiKey)</td><td>❌ No</td><td>Security keys, some enterprise configs. Tied permanently to one device.</td></tr>
  </tbody>
</table>
<p>Most consumer passkeys today are synced. A user's smart account is reachable from any of their Apple or Android devices without any manual key export.</p>

<h3>Platform-by-Platform Behaviour</h3>
<p>These findings come from direct implementation experience building passkey authentication on EVM (using Porto) and testing the same flows in preparation for the Stellar integration.</p>

<h4>On iPhone (iOS)</h4>
<ul>
  <li>Created via <code>ASAuthorizationController</code> (native API, not WebAuthn)</li>
  <li>Private key is generated inside the <strong>Secure Enclave</strong> (hardware chip)</li>
  <li>Stored in <strong>iCloud Keychain</strong></li>
  <li>Key material is <strong>end-to-end encrypted</strong> and synced to all Apple devices via iCloud's SOS (Secure Object Sync) protocol</li>
  <li>Biometric (Face ID / Touch ID) gates access to the key; it doesn't add another layer of encryption</li>
</ul>

<h4>On macOS Safari</h4>
<ul>
  <li>Same underlying system: Safari's WebAuthn API (<code>navigator.credentials.create()</code>) is backed by <code>ASAuthorizationController</code></li>
  <li>Stored in <strong>iCloud Keychain</strong></li>
  <li>Syncs automatically with iPhone if both are on the same Apple ID</li>
</ul>

<h4>On Android / Chrome</h4>
<ul>
  <li>Created via <code>CredentialManager</code> API (Android 14+) or the older FIDO2 API</li>
  <li>Stored in <strong>Google Password Manager</strong></li>
  <li>Synced across Android devices on the same Google account</li>
</ul>

<h4>On Chrome (desktop, non-macOS)</h4>
<ul>
  <li>Uses the OS authenticator (Windows Hello on Windows, backed by TPM chip)</li>
  <li>Synced via <strong>Google Password Manager</strong> when signed into Chrome</li>
</ul>

<h4>On Firefox (any platform)</h4>
<ul>
  <li>Stored <strong>locally only</strong> - no sync mechanism</li>
  <li>Each Firefox device has a separate passkey; there is no cross-device access.</li>
</ul>

<h3>Hardware Security Keys (Fallback)</h3>
<p>For Firefox, Linux, and users who prefer device-bound credentials - FIDO2 hardware keys are a supported fallback:</p>
<table>
  <thead>
    <tr><th>Key</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>YubiKey 5 series</td><td>Full FIDO2; USB-A/C + NFC</td></tr>
    <tr><td>Google Titan</td><td>FIDO2; USB-C + NFC</td></tr>
    <tr><td>Feitian ePass</td><td>Cost-effective FIDO2 option</td></tr>
  </tbody>
</table>

<h3>Recommended Fallback Strategy</h3>
<p><strong>Primary:</strong> Synced platform passkey (biometric): Chrome, Safari, Edge on macOS / iOS / Android / Windows</p>
<p><strong>Fallback 1:</strong> FIDO2 hardware security key: covers Firefox and Linux users</p>
<p><strong>Fallback 2:</strong> Backup Ed25519 keypair: recovery path when all passkey devices are lost or inaccessible</p>

<h3>Native Mobile Apps</h3>
<p>Web-embedded flows cover most wallet surfaces, but native iOS and Android apps bypass the browser entirely. On iOS, <code>ASAuthorizationController</code> creates and asserts passkeys directly through the Secure Enclave; on Android, the <code>CredentialManager</code> API handles the same via Google Password Manager. In both cases the public key and assertion are structurally identical to their WebAuthn browser equivalents and work against the same on-chain verifier contract. The compatibility matrix will include a native bridge section documenting the exact formatting differences and how to submit the resulting payload to the Soroban contract from React Native, Flutter, or native Swift and Kotlin.</p>

<h2>5. Implementation Plan</h2>
<h3>Approach</h3>
<p>The existing ecosystem has the hard parts solved at the protocol and contract level (<a style="text-decoration:underline" href="https://github.com/OpenZeppelin/stellar-contracts" target="_blank">OpenZeppelin stellar-contracts</a>) and at the full-featured SDK level (<a style="text-decoration:underline" href="https://github.com/kalepail/smart-account-kit" target="_blank">smart-account-kit</a>). What is missing is the minimal, approachable middle layer.</p>
<p>The approach is to extract the minimum viable slice from smart-account-kit, just the WebAuthn ceremony and Soroban signature payload construction, and build on top of the already-deployed OpenZeppelin contracts rather than reinventing the on-chain layer. The result is a thin SDK with a narrow API, headless UI components where developers own the styling, and a first-class stellar-wallets-kit connector.</p>

<h3>Architecture</h3>
<ul>
  <li><strong><code>passkey-sdk</code></strong>: the core layer. Wraps <a style="text-decoration:underline" href="https://simplewebauthn.dev/" target="_blank"><code><strong>@simplewebauthn/browser</strong></code></a> for registration and authentication, normalizes encoding differences between Chrome, Safari, and Firefox. The SDK does not touch or modify the on-chain verifier contracts; it only formats WebAuthn authentication data into the payload structure the verifier expects, so there is no risk of introducing new attack surface at the contract level.</li>
  <li><strong><code>passkey-ui</code></strong>: three headless Web Components covering the three core flows: <code>&lt;pk-create&gt;</code>, <code>&lt;pk-sign-tx&gt;</code>, and <code>&lt;pk-recover&gt;</code>. Each component manages the WebAuthn ceremony and emits typed events on completion, but ships with zero opinion on visual styling. For <code>&lt;pk-sign-tx&gt;</code> in particular, the developer owns the transaction summary view (what the user sees before confirming) while the component handles only the signing ceremony underneath. A single build works in React, Vue, Svelte, and vanilla JS without any adapter shim.</li>
  <li><strong><code>wallets-kit-adapter</code></strong>: the connector. Implements the <a style="text-decoration:underline" href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank"><code>@creit-tech/stellar-wallets-kit</code></a> module interface: <code>getAddress()</code>, <code>signTransaction()</code>, <code>isAvailable()</code>. The goal is a PR into the official repo so passkeys appear as a native wallet option alongside Freighter, Lobstr, and xBull.</li>
  <li><strong><code>demo</code></strong>: exercises the full flow end-to-end via the wallets-kit adapter using all three components: create passkey (<code>&lt;pk-create&gt;</code>), sign a Soroban transaction (<code>&lt;pk-sign-tx&gt;</code>), and recover via backup key (<code>&lt;pk-recover&gt;</code>).</li>
</ul>

<h3>Stellar Wallets Kit - Prior Engagement and Specification Alignment</h3>
<p>We have already opened discussions with the Creit Tech team (maintainers of <a style="text-decoration:underline" href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank"><code>@creit-tech/stellar-wallets-kit</code></a>) to validate the adapter interface before implementation begins:</p>
<ul>
  <li> <a style="text-decoration:underline" href="https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/91" target="_blank"><strong>Stellar-Wallets-Kit/issues/91</strong></a>: Raised to discuss adding a first-class passkey module to the kit, including the interface contract (<code>getAddress</code>, <code>signTransaction</code>, <code>isAvailable</code>) and how credential identity maps to wallet address derivation.</li>
  <li> <a style="text-decoration:underline" href="https://discord.com/channels/897514728459468821/1250851135561142423/1511354460251750562" target="_blank"><strong>Discord Discussion thread</strong></a>: Follow-up coordination in the Stellar developer community Discord confirming the approach and getting early feedback from the ecosystem.</li>
</ul>
<p>The implementation will follow the <code>IStellarWalletsKit</code> module specification exactly, meaning any dApp already using <a style="text-decoration:underline" href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank">stellar-wallets-kit</a> can add passkey support by registering the adapter - no changes to their signing flow required.</p>

<h3>Key Technical Decisions</h3>
<table>
  <thead>
    <tr><th>Decision</th><th>Choice</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>On-chain contracts</td><td><a style="text-decoration:underline" href="https://github.com/OpenZeppelin/stellar-contracts" target="_blank"><strong>OpenZeppelin stellar-contracts</strong></a></td><td>Already deployed, partially audited, modular verifiers</td></tr>
    <tr><td>WebAuthn library</td><td><a style="text-decoration:underline" href="https://simplewebauthn.dev/" target="_blank"><strong>@simplewebauthn/browser</strong></a></td><td>Smallest proven abstraction; normalizes browser differences</td></tr>
    <tr><td>UI approach</td><td>Headless Web Components</td><td>Framework-agnostic, works in React, Vue, Svelte, and vanilla JS with one build; developer owns styling</td></tr>
    <tr><td>Test framework</td><td>Vitest</td><td>Fast; native ESM; TypeScript-native</td></tr>
    <tr><td>License</td><td>MIT</td><td>Permissive; compatible with all downstream wallet integrations</td></tr>
  </tbody>
</table>

<h3>smart-account-kit / Tyler Ianiro: Prior Coordination</h3>
<p>We have been in active discussions with Tyler Ianiro (author of <a style="text-decoration:underline" href="https://github.com/kalepail/smart-account-kit" target="_blank"><code>smart-account-kit</code></a>) to align scope and avoid duplication before implementation begins:</p>
<ul>
  <li><a style="text-decoration:underline" href="https://discord.com/channels/897514728459468821/1250851135561142423/1511354460251750562" target="_blank"><strong>Discord discussion</strong></a>: Coordination in the Stellar developer Discord on scope boundaries, confirming that our layer (UI components and stellar-wallets-kit adapter) sits above smart-account-kit rather than duplicating its on-chain logic.</li>
  <li><a style="text-decoration:underline" href="https://github.com/kalepail/smart-account-kit/issues/10" target="_blank"><strong>smart-account-kit/issues/10</strong></a>: Open issue tracking integration points between the two projects, ensuring both evolve in a compatible direction.</li>
</ul>
<p>Our deliverable consumes smart-account-kit as a dependency for the on-chain ceremony and adds the missing UI and adapter layer on top. The two projects are complementary with no functional overlap.</p>

<h3>Timeline</h3>
<table>
  <thead>
    <tr><th>Month</th><th>Focus</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Month 1</td><td>Research</td><td><code>docs/compatibility-matrix.md</code> and <code>docs/usage-patterns.md</code> tested on real devices. Matrix rows carry <em>Last tested</em> dates and a defined re-test cadence (quarterly + per major browser release).</td></tr>
    <tr><td>Month 2</td><td>Core SDK + UI components</td><td><code>passkey-sdk</code> core package with full Vitest suite; <code>passkey-ui</code> Web Component set (<code>&lt;pk-create&gt;</code>, <code>&lt;pk-sign-tx&gt;</code>, <code>&lt;pk-recover&gt;</code>). All packages published to npm under MIT license.</td></tr>
    <tr><td>Month 3</td><td>stellar-wallets-kit integration</td><td><code>wallets-kit-adapter</code> implementing the <code>IStellarWalletsKit</code> module interface. PR raised against the official stellar-wallets-kit repo. Integration tested with Meridian Pay and Freighter teams.</td></tr>
    <tr><td>Month 4</td><td>Delivery</td><td>End-to-end demo live on Testnet. Public blog post on passkey compatibility learnings. All docs finalized and merged into wallet-kit repo. Ongoing maintenance: out-of-cycle update PRs within two weeks of any breaking change in smart-account-kit or WebAuthn platform APIs.</td></tr>
  </tbody>
</table>

<h2>6. About the Team</h2>
<p> <a style="text-decoration:underline" href="https://smartcloudsolutions.tech/" target="_blank"><strong>SmartCloud Solutions</strong></a> is a three-person engineering team that builds production systems for blockchain protocols, agent infrastructure, and developer tooling with a focus on SDKs, Kubernetes-native platforms, and cross-chain protocol work.</p>

<h3>Rohit Aggarwal: Founder / CTO, Web3 Protocols</h3>
<p>Rohit is the Founder/CTO of <strong>Raga Finance</strong> and <strong>Nexus Network</strong>. He previously led EVM development at <strong>pSTAKE Finance</strong>, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of <strong>IIT Bombay</strong> and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.</p>
<p><strong>Relevant to this project:</strong> Protocol-level Ethereum and Cosmos experience, SDK design, smart contract architecture, and prior work building developer tooling for DeFi protocols.</p>

<h3>Anmol Yadav: Infrastructure + Agents Engineer</h3>
<p>Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of <strong>Starship</strong>, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of <strong>Constructive</strong>. Previously tech lead at <strong>Persistence Labs</strong> and cloud platform engineer at Rakuten and Woven Planet.</p>
<p><strong>Relevant to this project:</strong> Multi-chain devnet tooling, SDK maintenance, cross-ecosystem developer infrastructure, and experience shipping production tooling adopted by protocol teams.</p>

<h3>Arham Chordia: Senior Blockchain Developer</h3>
<p>Arham is a Senior Blockchain Developer and alumnus of <strong>IIT Jodhpur</strong> (B.Tech Electrical Engineering). He has five years of experience shipping production blockchain infrastructure across multiple protocols spanning Cosmos, EVM, and Rust-based chains including SDK development from scratch, smart contract systems, and blockchain transaction pipelines. He will contribute across the full stack on this project.</p>

<h2>7. Milestone Breakdown</h2>
<p>Total ask: <strong>$90,000</strong>, disbursed across four tranches. M2 (SDK + UI) is a prerequisite for M3 but shares that tranche, ensuring the integration payment only releases once the full stack is reviewable end-to-end.</p>
<table>
  <thead>
    <tr><th>Milestone</th><th>Deliverable</th><th>Verification</th><th>Funding</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Grant Approval</strong></td><td>Project kickoff. Repository created, initial scaffolding published, team onboarded to SCF tooling.</td><td>Repo publicly visible; initial commit present</td><td><strong>$10,000</strong></td></tr>
    <tr><td><strong>M1</strong> Research</td><td><code>docs/compatibility-matrix.md</code> and <code>docs/usage-patterns.md</code> published in the repo. Matrix covers all browser/OS/hardware combinations tested on real devices. Each row carries a <em>Last tested</em> date. Maintenance process documented: quarterly re-test cadence, per-browser-release updates, ownership transfer to wallet-kit maintainers at M3.</td><td>Reviewers can inspect the matrix, reproduce test cases on listed devices, and verify Last tested dates are current</td><td><strong>$15,000</strong></td></tr>
    <tr><td><strong>M2</strong> SDK + UI Components</td><td><code>passkey-sdk</code> core package (WebAuthn registration, authentication, Soroban payload construction) with full Vitest test suite. <code>passkey-ui</code> headless Web Component set (<code>&lt;pk-create&gt;</code>, <code>&lt;pk-sign-tx&gt;</code>, <code>&lt;pk-recover&gt;</code>). All packages published to npm under MIT license with API documentation.</td><td><code>npm install</code> + run tests pass; Web Components render and emit events in a vanilla HTML page; API docs readable</td><td><strong>$15,000</strong></td></tr>
    <tr><td><strong>M3</strong> wallet-kit Integration</td><td><code>wallets-kit-adapter</code> implementing the full <code>IStellarWalletsKit</code> module interface (<code>getAddress</code>, <code>signTransaction</code>, <code>isAvailable</code>). PR raised against the official stellar-wallets-kit repo. Docs and compatibility matrix merged into the wallet-kit repo under a community-owned path, so the Stellar ecosystem retains the material after the grant ends. Integration validated with Meridian Pay and Freighter teams.</td><td>PR open and passing CI in stellar-wallets-kit repo; passkey option appears alongside Freighter and Lobstr in the kit; integration confirmed by at least one wallet team</td><td><strong>$15,000</strong></td></tr>
    <tr><td><strong>M4</strong> Delivery + Maintenance</td><td>End-to-end demo live on Testnet. Public blog post summarizing passkey compatibility learnings. Ongoing maintenance for the first year: quarterly compatibility re-tests, out-of-cycle update PRs within two weeks of any breaking change in smart-account-kit or WebAuthn platform APIs, and support for wallet teams integrating the adapter.</td><td>Demo URL live and walkthrough-able; blog post published; maintenance commitment documented in repo CONTRIBUTING.md</td><td><strong>$35,000</strong></td></tr>
  </tbody>
</table>
`

export function RFPViewer() {
  return (
    <div
      className="rfp-content prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: RFP_HTML }}
    />
  )
}
