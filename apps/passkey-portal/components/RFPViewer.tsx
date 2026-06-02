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
<p>Passkeys solve this. They are already how billions of users authenticate with their banks, Apple ID, and Google accounts. They require no install, no seed phrase, and no new mental model. Stellar's Protocol 21 added native support for the cryptography passkeys use. What is missing is a <strong>documented, reusable, production-quality SDK and UI layer</strong> integrated with stellar-wallet-kit that Stellar wallet developers can actually ship.</p>

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
<p>Traditional blockchain wallets require users to understand and protect a private key directly. Passkeys move the key into the OS security layer — the same layer that protects Apple Pay, Windows Hello, and Android Keystore. The user interacts only with a familiar biometric prompt.</p>

<h2>3. Passkeys on Stellar</h2>
<h3>Protocol 21 and secp256r1</h3>
<p>Stellar's Protocol 21 (live on Mainnet) introduced native secp256r1 signature verification inside Soroban smart contracts (CAP-0051). With Protocol 21, a passkey can directly authorize a Soroban transaction with no bridging, no wrapping, and no trusted intermediary.</p>

<h3>Smart Wallet Architecture</h3>
<p>On Stellar, a passkey wallet is a <strong>Soroban smart contract</strong>, not a key pair. The contract maintains a list of authorized signers, and one of those signers is a passkey (a P-256 public key).</p>
<pre><code>User's Wallet = Soroban Smart Contract
  └── Signer 1: Passkey (P-256 public key from device)
  └── Signer 2: Backup Ed25519 keypair (recovery)
  └── Signer N: Additional passkeys, session keys, policies...</code></pre>

<h2>4. Platform Compatibility Matrix</h2>
<h3>Browsers (Desktop)</h3>
<table>
  <thead>
    <tr><th>Browser</th><th>Passkey Support</th><th>Platform Authenticator</th><th>Credential Sync</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>Chrome 106+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Google Password Manager</td><td>Recommended primary target</td></tr>
    <tr><td>Edge 106+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Windows Hello</td><td>Chromium-based; identical to Chrome</td></tr>
    <tr><td>Safari 16+</td><td>✅ Full</td><td>✅ Yes</td><td>✅ iCloud Keychain</td><td>Required path for iOS</td></tr>
    <tr><td>Firefox 122+</td><td>⚠️ Partial</td><td>❌ No</td><td>❌ No</td><td>No biometric platform authenticator</td></tr>
    <tr><td>Brave</td><td>✅ Full</td><td>✅ Yes</td><td>✅ Via OS</td><td>Works identically to Chrome</td></tr>
  </tbody>
</table>

<h3>Operating Systems / Mobile</h3>
<table>
  <thead>
    <tr><th>Platform</th><th>Support</th><th>Authenticator</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td>macOS 13+ (Ventura)</td><td>✅ Full</td><td>Touch ID / iCloud Keychain</td><td>Syncs across all Apple devices</td></tr>
    <tr><td>iOS 16+</td><td>✅ Full</td><td>Face ID / Touch ID</td><td>Smoothest mobile experience</td></tr>
    <tr><td>Android 9+ (Chrome)</td><td>✅ Full</td><td>Fingerprint / face unlock</td><td>Requires Google Play Services</td></tr>
    <tr><td>Windows 10/11</td><td>✅ Full</td><td>Windows Hello</td><td>Works on Edge and Chrome</td></tr>
    <tr><td>Linux (desktop)</td><td>⚠️ Partial</td><td>Hardware keys only</td><td>No platform authenticator</td></tr>
  </tbody>
</table>

<h2>5. Implementation Plan</h2>
<h3>Approach</h3>
<p>The existing ecosystem has the hard parts solved at the protocol and contract level (OpenZeppelin stellar-contracts) and at the full-featured SDK level (smart-account-kit). What is missing is the minimal, approachable middle layer.</p>

<h3>Package Architecture</h3>
<pre><code>packages/
  passkey-sdk/          # WebAuthn ceremonies + Soroban signature formatting
  passkey-ui/           # Headless UI components (Web Components)
  wallets-kit-adapter/  # stellar-wallets-kit connector
apps/
  demo/                 # End-to-end demo (Vite + TypeScript)</code></pre>

<h3>Key Technical Decisions</h3>
<table>
  <thead>
    <tr><th>Decision</th><th>Choice</th><th>Reason</th></tr>
  </thead>
  <tbody>
    <tr><td>On-chain contracts</td><td>OpenZeppelin stellar-contracts</td><td>Already deployed, partially audited, modular verifiers</td></tr>
    <tr><td>WebAuthn library</td><td>@simplewebauthn/browser</td><td>Smallest proven abstraction; normalizes browser differences</td></tr>
    <tr><td>UI approach</td><td>Headless Web Components</td><td>Framework-agnostic; developer owns styling</td></tr>
    <tr><td>Stellar SDK</td><td>@stellar/stellar-sdk</td><td>Required for Soroban transaction construction</td></tr>
    <tr><td>Test framework</td><td>Vitest</td><td>Fast; native ESM; TypeScript-native</td></tr>
  </tbody>
</table>

<h3>Timeline</h3>
<table>
  <thead>
    <tr><th>Month</th><th>Focus</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Month 1</td><td>Research and compatibility docs</td><td>compatibility-matrix.md and usage-patterns.md</td></tr>
    <tr><td>Month 2</td><td>Core SDK</td><td>packages/passkey-sdk: WebAuthn ceremony wrappers, Soroban payload formatter, full Vitest suite</td></tr>
    <tr><td>Month 3</td><td>Headless UI components</td><td>packages/passkey-ui: register, sign, recover Web Components</td></tr>
    <tr><td>Month 4</td><td>Wallets Kit adapter</td><td>packages/wallets-kit-adapter + PR into official repo</td></tr>
    <tr><td>Month 5</td><td>Hardening and delivery</td><td>Final docs, end-to-end demo on testnet, public blog post</td></tr>
  </tbody>
</table>

<h2>6. About the Team</h2>
<p><strong>SmartCloud</strong> is a two-engineer studio that builds production systems for agent and infrastructure teams.</p>

<h3>Rohit Aggarwal: Founder / CTO, Web3 Protocols</h3>
<p>Rohit is the Founder/CTO of <strong>Raga Finance</strong> and <strong>Nexus Network</strong>. He previously led EVM development at <strong>pSTAKE Finance</strong>, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of <strong>IIT Bombay</strong> and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.</p>

<h3>Anmol Yadav: Infrastructure + Agents Engineer</h3>
<p>Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of <strong>Starship</strong>, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of <strong>Constructive</strong>.</p>

<h2>7. Milestone Breakdown</h2>
<table>
  <thead>
    <tr><th>Milestone</th><th>Deliverable</th><th>Verification</th><th>Funding</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>M1</strong> Compatibility Research</td><td>docs/compatibility-matrix.md and docs/usage-patterns.md published</td><td>Reviewers can inspect the matrix, reproduce test cases</td><td>Tranche 1</td></tr>
    <tr><td><strong>M2</strong> Passkey SDK</td><td>packages/passkey-sdk published with startRegistration(), startAuthentication(), buildSignaturePayload()</td><td>npm install + run tests; read API docs</td><td>Tranche 2</td></tr>
    <tr><td><strong>M3</strong> UI Components</td><td>packages/passkey-ui Web Components for register, sign, and recover flows</td><td>Load demo app; test each flow in Chrome, Safari, Firefox</td><td>Tranche 3</td></tr>
    <tr><td><strong>M4</strong> Wallets Kit Adapter</td><td>packages/wallets-kit-adapter + PR into official @creit-tech/stellar-wallets-kit repo</td><td>Review the PR; run the demo app end-to-end</td><td>Tranche 4</td></tr>
    <tr><td><strong>M5</strong> Delivery</td><td>All docs finalized. Public blog post published. Full demo working on Testnet.</td><td>End-to-end demo walkthrough; blog post live</td><td></td></tr>
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
