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

<h2>5. Implementation Plan</h2>
<h3>Approach</h3>
<p>The existing ecosystem has the hard parts solved at the protocol and contract level (<a href="https://github.com/OpenZeppelin/stellar-contracts" target="_blank">OpenZeppelin stellar-contracts</a>) and at the full-featured SDK level (<a href="https://github.com/kalepail/smart-account-kit" target="_blank">smart-account-kit</a>). What is missing is the minimal, approachable middle layer.</p>
<p>The approach is to extract the minimum viable slice from smart-account-kit, just the WebAuthn ceremony and Soroban signature payload construction, and build on top of the already-deployed OpenZeppelin contracts rather than reinventing the on-chain layer. The result is a thin SDK with a narrow API, headless UI components where developers own the styling, and a first-class stellar-wallets-kit connector.</p>

<h3>Architecture</h3>
<ul>
  <li><strong><code>passkey-sdk</code></strong>: the core layer. Wraps <a href="https://simplewebauthn.dev/" target="_blank"><code><strong>@simplewebauthn/browser</strong></code></a> for registration and authentication, normalizes encoding differences between Chrome, Safari, and Firefox.</li>
  <li><strong><code>passkey-ui</code></strong>: headless Web Components. Each component handles state (loading, error, success) and emits typed events, but ships with no opinion on styling.</li>
  <li><strong><code>wallets-kit-adapter</code></strong>: the connector. Implements the <a href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank"><code>@creit-tech/stellar-wallets-kit</code></a> module interface: <code>getAddress()</code>, <code>signTransaction()</code>, <code>isAvailable()</code>. The goal is a PR into the official repo so passkeys appear as a native wallet option alongside Freighter, Lobstr, and xBull.</li>
  <li><strong><code>demo</code></strong>: exercises the full flow end-to-end via the wallets-kit adapter: create smart wallet, register passkey, sign a Soroban transaction, recover via backup key.</li>
</ul>

<h3>Stellar Wallets Kit - Prior Engagement and Specification Alignment</h3>
<p>We have already opened discussions with the Creit Tech team (maintainers of <a href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank"><code>@creit-tech/stellar-wallets-kit</code></a>) to validate the adapter interface before implementation begins:</p>
<ul>
  <li> <a href="https://github.com/Creit-Tech/Stellar-Wallets-Kit/issues/91" target="_blank"><strong>Stellar-Wallets-Kit/issues/91</strong></a>: Raised to discuss adding a first-class passkey module to the kit, including the interface contract (<code>getAddress</code>, <code>signTransaction</code>, <code>isAvailable</code>) and how credential identity maps to wallet address derivation.</li>
  <li> <a href="https://discord.com/channels/897514728459468821/1250851135561142423/1511354460251750562" target="_blank"><strong>Discord Discussion thread</strong></a>: Follow-up coordination in the Stellar developer community Discord confirming the approach and getting early feedback from the ecosystem.</li>
</ul>
<p>The implementation will follow the <code>IStellarWalletsKit</code> module specification exactly, meaning any dApp already using <a href="https://github.com/Creit-Tech/Stellar-Wallets-Kit" target="_blank">stellar-wallets-kit</a> can add passkey support by registering the adapter - no changes to their signing flow required.</p>

<h3>Key Technical Decisions</h3>
<table>
  <thead>
    <tr><th>Decision</th><th>Choice</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>On-chain contracts</td><td><a href="https://github.com/OpenZeppelin/stellar-contracts" target="_blank"><strong>OpenZeppelin stellar-contracts</strong></a></td><td>Already deployed, partially audited, modular verifiers</td></tr>
    <tr><td>WebAuthn library</td><td><a href="https://simplewebauthn.dev/" target="_blank"><strong>@simplewebauthn/browser</strong></a></td><td>Smallest proven abstraction; normalizes browser differences</td></tr>
    <tr><td>UI approach</td><td>Headless Web Components</td><td>Framework-agnostic; developer owns styling</td></tr>
    <tr><td>Test framework</td><td>Vitest</td><td>Fast; native ESM; TypeScript-native</td></tr>
  </tbody>
</table>

<h3>Timeline</h3>
<table>
  <thead>
    <tr><th>Month</th><th>Focus</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Month 1</td><td>Research and start building</td><td>compatibility-matrix.md and usage-patterns.md tested on real devices</td></tr>
    <tr><td>Month 2</td><td>PR to stellar-wallet-kit</td><td>Work with stellar-wallet-kit team to implement</td></tr>
    <tr><td>Month 3</td><td>Testing</td><td>Talk to dApp teams to test out the solution</td></tr>
  </tbody>
</table>

<h2>6. About the Team</h2>
<p> <a href="https://smartcloudsolutions.tech/" target="_blank"><strong>SmartCloud Solutions</strong></a> is a three-person engineering team that builds production systems for blockchain protocols, agent infrastructure, and developer tooling with a focus on SDKs, Kubernetes-native platforms, and cross-chain protocol work.</p>

<h3>Rohit Aggarwal: Founder / CTO, Web3 Protocols</h3>
<p>Rohit is the Founder/CTO of <strong>Raga Finance</strong> and <strong>Nexus Network</strong>. He previously led EVM development at <strong>pSTAKE Finance</strong>, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of <strong>IIT Bombay</strong> and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.</p>
<p><strong>Relevant to this project:</strong> Protocol-level Ethereum and Cosmos experience, SDK design, smart contract architecture, and prior work building developer tooling for DeFi protocols.</p>

<h3>Anmol Yadav: Infrastructure + Agents Engineer</h3>
<p>Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of <strong>Starship</strong>, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of <strong>Constructive</strong>. Previously tech lead at <strong>Persistence Labs</strong> and cloud platform engineer at Rakuten and Woven Planet.</p>
<p><strong>Relevant to this project:</strong> Multi-chain devnet tooling, SDK maintenance, cross-ecosystem developer infrastructure, and experience shipping production tooling adopted by protocol teams.</p>

<h3>Arham Chordia: Senior Blockchain Developer</h3>
<p>Arham is a Senior Blockchain Developer and alumnus of <strong>IIT Jodhpur</strong> (B.Tech Electrical Engineering). He has five years of experience shipping production blockchain infrastructure across multiple protocols spanning Cosmos, EVM, and Rust-based chains including SDK development from scratch, smart contract systems, and blockchain transaction pipelines. He will contribute across the full stack on this project.</p>

<h2>7. Milestone Breakdown</h2>
<p>SCF Build Award is milestone-based with funding split across tranches tied to specific, verifiable deliverables.</p>
<table>
  <thead>
    <tr><th>Milestone</th><th>Deliverable</th><th>Verification</th><th>Funding</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>M1</strong> Research Document</td><td>docs/compatibility-matrix.md and docs/usage-patterns.md published in the repo. Matrix covers all browser/OS/hardware combinations, tested on real devices.</td><td>Reviewers can inspect the matrix, reproduce test cases, and verify coverage</td><td>Tranche 1</td></tr>
    <tr><td><strong>M2</strong> Passkey SDK</td><td>Package delivered and PR raised with stellar-wallet-kit</td><td>npm install + run tests; read API docs</td><td>Tranche 2</td></tr>
    <tr><td><strong>M3</strong> Delivery</td><td>All docs finalized. Public blog post published summarizing passkey compatibility learnings. Full demo working on Testnet.</td><td>End-to-end demo walkthrough; blog post live</td><td></td></tr>
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
