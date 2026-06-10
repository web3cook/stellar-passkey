'use client'

const RFP_HTML = `
<h1>SCF RFP Proposal: Passkey UI for Stellar Smart Accounts</h1>

<h2>1. Problem Statement</h2>
<p>Protocol 21 shipped native secp256r1 verification (CAP-0051), and the ecosystem responded: OpenZeppelin published smart account contracts with WebAuthn verifiers, and <a style="text-decoration:underline" href="https://github.com/kalepail/smart-account-kit" target="_blank">smart-account-kit</a> proved the full ceremony works end to end. Yet no production Stellar wallet ships passkey login today. The blockers are no longer cryptographic or contract-level. They are integration-level:</p>
<ul>
  <li><strong>No compatibility baseline.</strong> Passkey behavior varies by browser, OS, sync provider, and authenticator hardware, and the failure modes that matter on Stellar (signature encodings the on-chain verifier rejects, credential-to-contract-address resolution, testnet resets orphaning credentials) are documented nowhere. Every team that attempts an integration rediscovers them from scratch.</li>
  <li><strong>No reusable UI layer.</strong> Each existing demo hand-rolls its own create, sign, and recover flows. None are packaged for reuse, so the integration cost repeats for every wallet team.</li>
  <li><strong>No stellar-wallets-kit module.</strong> Passkeys are not a selectable wallet option in the kit most Stellar dApps already use, so adoption requires custom plumbing per dApp.</li>
</ul>
<p>This proposal delivers the three missing pieces: a compatibility matrix and pattern guide tested on physical devices, a minimal SDK with headless UI components, and a first-class stellar-wallets-kit module, with the documentation and test harness living in community-owned repos after the grant ends.</p>

<h2>2. Passkeys on Stellar</h2>
<p>A passkey is a P-256 (secp256r1) keypair held by the device authenticator (Secure Enclave, TPM, or security key). The private key never leaves the secure hardware; the public key is registered as a signer on-chain. Protocol 21's native secp256r1 verification means a passkey can directly authorize a Soroban transaction with no bridging, no wrapping, and no trusted intermediary.</p>

<h3>Smart Wallet Architecture</h3>
<p>On Stellar, a passkey wallet is a <strong>Soroban smart contract</strong>, not a key pair. The contract maintains a list of authorized signers, and one of those signers is a passkey.</p>
<pre><code>User's Wallet = Soroban Smart Contract
  └── Signer 1: Passkey (P-256 public key from device)
  └── Signer 2: Backup Ed25519 keypair (recovery)
  └── Signer N: Additional passkeys, session keys, policies...</code></pre>

<h2>3. Platform Compatibility: The Core Research Deliverable</h2>

<h3>What We Have Already Found</h3>
<p>Before writing this proposal we built a working passkey wallet on Stellar Testnet: create a smart account with a passkey, fund it, sign and submit transfers through the deployed OpenZeppelin verifier. The findings below came out of that implementation. None of them appear in the WebAuthn spec, the simplewebauthn docs, or any existing Stellar guide. Each one cost us real debugging time, and each one will cost every wallet team the same until it is written down:</p>
<table>
  <thead>
    <tr><th>Finding</th><th>Why it bites on Stellar specifically</th><th>Resolution</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>DER signatures and high-S values</strong></td><td>Authenticators return DER-encoded ECDSA signatures, often with high-S values. Web servers accept both forms, so nothing upstream warns you. The on-chain verifier accepts only raw r‖s in low-S form; the transaction fails in simulation with an opaque auth error.</td><td>SDK normalizes DER to raw r‖s and applies low-S normalization on every assertion.</td></tr>
    <tr><td><strong>credentialId → contract address resolution</strong></td><td>WebAuthn returns only a credentialId at sign-in. The wallet address is a deterministic function of deployer key and salt, so re-deriving it silently yields a wrong address if the deployer configuration ever changes. The wallet appears to vanish while funds sit at the original address.</td><td>Persist the mapping at creation and never re-derive. Cross-device sign-in needs a durable mapping source (indexer or registry), which the SDK treats as a first-class requirement.</td></tr>
    <tr><td><strong>Sync does not carry the wallet</strong></td><td>A passkey synced to a second device via iCloud or Google authenticates fine there, but the new device has no idea which contract the credential controls. The "it just syncs" story breaks exactly at the Stellar boundary.</td><td>Documented pattern: durable credentialId-to-contract mapping plus an explicit first-sign-in-on-new-device flow.</td></tr>
    <tr><td><strong>Challenge binding to Soroban payloads</strong></td><td>The WebAuthn challenge must be the transaction's signature payload hash, base64url-encoded, because the verifier recomputes sha256(authenticatorData ‖ sha256(clientDataJSON)) on-chain and parses clientDataJSON inside the contract. Encoding it wrong produces signatures that verify in the browser and fail on-chain.</td><td>SDK owns challenge construction end to end; the pattern guide documents the exact byte path.</td></tr>
    <tr><td><strong>Zero-balance onboarding</strong></td><td>A new user's contract holds no XLM, so deployment and first transactions need a sponsor. The sponsor signs as fee source while the passkey authorizes the operation via contract auth; conflating the two roles breaks address derivation (see above) or auth.</td><td>SDK keeps fee sponsorship and operation auth strictly decoupled, with the sponsor strategy pluggable.</td></tr>
    <tr><td><strong>Testnet resets orphan credentials</strong></td><td>Quarterly testnet resets delete the contract while the passkey persists in iCloud or Google Password Manager. WebAuthn has no delete API, so credential pickers fill with passkeys pointing at wallets that no longer exist.</td><td>Documented detect-and-recreate flow: probe the contract on-chain before trusting a stored session, and guide the user to a fresh wallet when it is gone.</td></tr>
    <tr><td><strong>base64 vs base64url credential IDs</strong></td><td>Libraries disagree on credentialId encoding. A mismatch makes storage lookups fail silently: authentication succeeds, then the app cannot find the wallet it just authenticated.</td><td>SDK normalizes to base64url at every boundary.</td></tr>
  </tbody>
</table>

<h3>The Two Types of Passkeys</h3>
<p>One distinction drives most UX and recovery design decisions:</p>
<table>
  <thead>
    <tr><th>Type</th><th>Stored where</th><th>Synced?</th><th>Notes</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Synced passkey</strong> (discoverable / resident key)</td><td>iCloud Keychain / Google Password Manager</td><td>✅ Yes</td><td>What most consumers will have. Works across devices on the same account.</td></tr>
    <tr><td><strong>Device-bound passkey</strong></td><td>Hardware chip (Secure Enclave, TPM, YubiKey)</td><td>❌ No</td><td>Security keys, some enterprise configs. Tied permanently to one device.</td></tr>
  </tbody>
</table>

<h3>Platform Behavior Summary</h3>
<table>
  <thead>
    <tr><th>Platform</th><th>Authenticator / sync</th><th>What affects wallet integrations</th></tr>
  </thead>
  <tbody>
    <tr><td>macOS / iOS (Safari, Chrome)</td><td>Secure Enclave, synced via iCloud Keychain</td><td>Full support; WebAuthn backed by ASAuthorizationController</td></tr>
    <tr><td>Android 14+ (Chrome)</td><td>CredentialManager, synced via Google Password Manager</td><td>Full support; NFC hardware keys partially limited</td></tr>
    <tr><td>Windows 11 (Chrome, Edge)</td><td>Windows Hello (TPM) + Google Password Manager in Chrome</td><td>Full support</td></tr>
    <tr><td>Firefox (any OS)</td><td>Device-local only, no sync</td><td>Must be treated as device-bound; backup signer is mandatory, conditional UI only on 119+</td></tr>
    <tr><td>Linux</td><td>No platform authenticator</td><td>Hardware key (FIDO2) is the only path</td></tr>
    <tr><td>Hardware keys (YubiKey 5, Titan)</td><td>Device-bound, CTAP2 over USB/NFC</td><td>Fallback for Firefox, Linux, and security-conscious users</td></tr>
  </tbody>
</table>

<h3>Matrix Scope: What M1 Covers and What Earns the Milestone</h3>
<p>The compatibility matrix is tested on physical hardware we own or procure. Emulators are excluded for the authenticator path because they do not reproduce enclave, sync, or transport behavior. Coverage:</p>
<table>
  <thead>
    <tr><th>Surface</th><th>Combinations</th></tr>
  </thead>
  <tbody>
    <tr><td>macOS 13/14</td><td>Safari 16/17, Chrome, Edge, Firefox</td></tr>
    <tr><td>iOS 16/17 (iPhone and iPad)</td><td>Safari, Chrome, in-app WKWebView</td></tr>
    <tr><td>Android 14/15 (Pixel and Samsung)</td><td>Chrome, Samsung Internet, Firefox</td></tr>
    <tr><td>Windows 11</td><td>Chrome, Edge, Firefox (Windows Hello / TPM)</td></tr>
    <tr><td>Linux (Ubuntu LTS)</td><td>Chrome, Firefox (hardware-key path)</td></tr>
    <tr><td>Hardware authenticators</td><td>YubiKey 5 (USB-A, USB-C, NFC), Google Titan</td></tr>
    <tr><td>Cross-cutting contexts</td><td>Private browsing, in-app browsers, cross-device QR (hybrid transport), conditional UI</td></tr>
  </tbody>
</table>
<p>That is roughly 25 device/browser rows, each exercised with the full on-chain test case.</p>
<p><strong>A test case is</strong> a scripted flow executed on a physical device against the deployed Testnet verifier: create a credential, deploy the smart account, sign and submit a real Soroban transfer, verify the signature on-chain, then execute recovery via the backup signer. Negative paths are included: user cancellation, timeout, cross-device QR handoff, and conditional UI. Each run records device model, OS version, browser version, authenticator, result (works / quirk / broken), workaround if any, and the test date.</p>
<p><strong>A finding is</strong> an entry in the findings log: a behavior that affects a Stellar integration and is not documented upstream, with reproduction steps, the affected combinations, and a workaround that is either encoded in the SDK or written into the pattern guide. The seven findings above, discovered before any grant money is spent, set the quality bar for what M1 delivers.</p>
<p>The M1 payment is verifiable against artifacts, not effort: the matrix with every row carrying recorded versions and a Last tested date, the findings log with reproductions, and the published test harness that lets reviewers re-run any row on matching hardware.</p>

<h3>Keeping the Matrix Alive</h3>
<p>A pattern guide that goes stale within six months is worse than no guide at all, so staleness is addressed structurally rather than with good intentions:</p>
<ul>
  <li><strong>The test harness is a deliverable, not internal tooling.</strong> The scripted suite and a step-by-step device runbook are published in the repo, so any contributor can re-run any matrix row without us.</li>
  <li><strong>CI catches drift between physical runs.</strong> Virtual-authenticator tests (Chrome DevTools WebAuthn protocol, driven through Playwright) run on every commit and on a weekly schedule, catching API-level breakage automatically. Physical re-tests run quarterly and after every major browser release; each row carries its Last tested date.</li>
  <li><strong>Ownership outlives the grant.</strong> Docs, matrix, and harness merge into the stellar-wallets-kit repo under a community-owned path at M3. We remain named maintainers for twelve months after delivery; after that, stewardship sits with the stellar-wallets-kit maintainers, agreed with Creit Tech ahead of time.</li>
  <li><strong>No single point of failure.</strong> Everything is MIT-licensed in community repos and depends on no SmartCloud infrastructure, accounts, or credentials. SmartCloud Solutions has been operating for over two years and is committed to staying active: we will support the documentation, update it periodically as browsers and platforms evolve, and keep contributing so the matrix does not go stale. And if we ever stop operating, the matrix remains reproducible by anyone with the runbook and the listed devices.</li>
</ul>

<h3>Recommended Fallback Strategy</h3>
<p><strong>Primary:</strong> Synced platform passkey (biometric): Chrome, Safari, Edge on macOS / iOS / Android / Windows</p>
<p><strong>Fallback 1:</strong> FIDO2 hardware security key: covers Firefox and Linux users</p>
<p><strong>Fallback 2:</strong> Backup Ed25519 keypair: recovery path when all passkey devices are lost or inaccessible</p>

<h3>Native Mobile Apps</h3>
<p>Native iOS (<code>ASAuthorizationController</code>) and Android (<code>CredentialManager</code>) apps bypass the browser but produce assertions structurally identical to their WebAuthn equivalents, and they work against the same on-chain verifier. The compatibility matrix includes a native bridge section documenting the formatting differences and how to submit the resulting payload to the Soroban contract from React Native, Flutter, or native Swift and Kotlin.</p>

<h2>4. Implementation Plan</h2>
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
<p>Our deliverable uses smart-account-kit as a reference implementation to extract the minimum viable WebAuthn and Soroban payload logic into a new, standalone SDK, then adds the UI and adapter layer on top. The two projects are complementary with no functional overlap.</p>

<h3>Timeline</h3>
<p>Two months of build starting June 15, 2026, then a twelve-month maintenance window. The compressed schedule is realistic because the Testnet implementation already exists: the research phase starts from working code and a findings log, not a blank repository.</p>
<table>
  <thead>
    <tr><th>Period</th><th>Focus</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Days 1-15<br/>Jun 15 - Jun 29, 2026</td><td>Compatibility research</td><td>Test harness and device runbook published. <code>docs/compatibility-matrix.md</code> and <code>docs/usage-patterns.md</code> tested on physical devices across the full coverage table in Section 3, with findings log. Matrix rows carry <em>Last tested</em> dates.</td></tr>
    <tr><td>Days 16-35<br/>Jun 30 - Jul 19, 2026</td><td>Core SDK + UI components</td><td><code>passkey-sdk</code> core package with full Vitest suite; <code>passkey-ui</code> Web Component set (<code>&lt;pk-create&gt;</code>, <code>&lt;pk-sign-tx&gt;</code>, <code>&lt;pk-recover&gt;</code>). All packages published to npm under MIT license.</td></tr>
    <tr><td>Days 36-55<br/>Jul 20 - Aug 8, 2026</td><td>stellar-wallets-kit integration + delivery</td><td><code>wallets-kit-adapter</code> implementing the <code>IStellarWalletsKit</code> module interface. PR raised against the official stellar-wallets-kit repo. Integration tested with Meridian Pay and Freighter teams. End-to-end demo live on Testnet. Public blog post on compatibility learnings. Docs, matrix, and harness merged into the stellar-wallets-kit repo.</td></tr>
    <tr><td>Months 3-14<br/>Aug 9, 2026 - Aug 8, 2027</td><td>Maintenance window</td><td>Quarterly physical re-tests and per-major-browser-release updates. CI virtual-authenticator suite stays green. Out-of-cycle update PRs within two weeks of any breaking change in WebAuthn platform APIs or the reference contracts. Support for wallet teams integrating the adapter.</td></tr>
  </tbody>
</table>

<h2>5. About the Team</h2>
<p> <a style="text-decoration:underline" href="https://smartcloudsolutions.tech/" target="_blank"><strong>SmartCloud Solutions</strong></a> is a three-person engineering team that builds production systems for blockchain protocols, agent infrastructure, and developer tooling with a focus on SDKs, Kubernetes-native platforms, and cross-chain protocol work.</p>

<h3>Rohit Aggarwal: Founder / CTO, Web3 Protocols</h3>
<p>Rohit is the Founder/CTO of <strong>Raga Finance</strong> and <strong>Nexus Network</strong>. He previously led EVM development at <strong>pSTAKE Finance</strong>, building liquid staking on BNB/Ethereum and cross-chain L2 staking via LayerZero. He is an alumnus of <strong>IIT Bombay</strong> and has deep experience designing minimal, production-quality protocol SDKs and smart contract systems.</p>
<p><strong>Relevant to this project:</strong> Protocol-level Ethereum and Cosmos experience, SDK design, smart contract architecture, and prior work building developer tooling for DeFi protocols.</p>

<h3>Anmol Yadav: Infrastructure + Agents Engineer</h3>
<p>Anmol specializes in Kubernetes-native platforms and agent infrastructure. He is the maintainer of <strong>Starship</strong>, the Kubernetes-native multi-chain devnet adopted across the Cosmos ecosystem and co-founder of <strong>Constructive</strong>. Previously tech lead at <strong>Persistence Labs</strong> and cloud platform engineer at Rakuten and Woven Planet.</p>
<p><strong>Relevant to this project:</strong> Multi-chain devnet tooling, SDK maintenance, cross-ecosystem developer infrastructure, and experience shipping production tooling adopted by protocol teams.</p>

<h3>Arham Chordia: Senior Blockchain Developer</h3>
<p>Arham is a Senior Blockchain Developer and alumnus of <strong>IIT Jodhpur</strong> (B.Tech Electrical Engineering). He has five years of experience shipping production blockchain infrastructure across multiple protocols spanning Cosmos, EVM, and Rust-based chains including SDK development from scratch, smart contract systems, and blockchain transaction pipelines. He will contribute across the full stack on this project.</p>

<h2>6. Milestone Breakdown</h2>
<p>Total ask: <strong>$90,000</strong> across four tranches: kickoff plus three build milestones. The M1 tranche funds the most research-intensive phase, procuring and testing roughly 25 physical device and browser combinations and converting the results into reviewer-verifiable documentation. Every milestone pays against inspectable artifacts rather than reported effort.</p>
<table>
  <thead>
    <tr><th>Milestone</th><th>Target Date</th><th>Deliverable</th><th>Verification</th><th>Funding</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Grant Approval</strong></td><td>Jun 15, 2026</td><td>Project kickoff. Repository created, initial scaffolding published, team onboarded to SCF tooling.</td><td>Repo publicly visible; initial commit present</td><td><strong>$10,000</strong></td></tr>
    <tr><td><strong>M1</strong> Compatibility Research</td><td>Jun 29, 2026</td><td><code>docs/compatibility-matrix.md</code> and <code>docs/usage-patterns.md</code> covering the full coverage table in Section 3, tested on physical hardware. Findings log where every entry carries reproduction steps, affected combinations, and a workaround. Test harness and device runbook published so any row can be independently re-run.</td><td>Every matrix row shows device model, OS/browser versions, result, and a current <em>Last tested</em> date; reviewers can re-run any row with the published harness on matching hardware; findings log entries are reproducible</td><td><strong>$20,000</strong></td></tr>
    <tr><td><strong>M2</strong> SDK + UI Components</td><td>Jul 19, 2026</td><td><code>passkey-sdk</code> core package (WebAuthn registration, authentication, Soroban payload construction) with full Vitest test suite. <code>passkey-ui</code> headless Web Component set (<code>&lt;pk-create&gt;</code>, <code>&lt;pk-sign-tx&gt;</code>, <code>&lt;pk-recover&gt;</code>). All packages published to npm under MIT license with API documentation.</td><td><code>npm install</code> + run tests pass; Web Components render and emit events in a vanilla HTML page; API docs readable</td><td><strong>$30,000</strong></td></tr>
    <tr><td><strong>M3</strong> stellar-wallets-kit Integration + Delivery</td><td>Aug 8, 2026</td><td><code>wallets-kit-adapter</code> implementing the full <code>IStellarWalletsKit</code> module interface (<code>getAddress</code>, <code>signTransaction</code>, <code>isAvailable</code>). PR raised against the official stellar-wallets-kit repo. Docs, matrix, and test harness merged into the repo under a community-owned path so the ecosystem retains and can re-run the material after the grant. Integration validated with Meridian Pay and Freighter teams. End-to-end demo live on Testnet. Public blog post on compatibility learnings. Twelve-month maintenance window begins: quarterly physical re-tests, CI virtual-authenticator suite on every commit, out-of-cycle update PRs within two weeks of breaking upstream changes, named maintainers documented with stewardship passing to stellar-wallets-kit maintainers afterward.</td><td>PR open and passing CI in stellar-wallets-kit repo; passkey option appears alongside Freighter and Lobstr in the kit; integration confirmed by at least one wallet team; demo URL live and walkthrough-able; blog post published; maintenance plan and ownership transfer documented in repo <code>CONTRIBUTING.md</code></td><td><strong>$30,000</strong></td></tr>
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
