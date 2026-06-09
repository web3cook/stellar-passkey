# stellar-passkey

Passkey-based smart accounts for Stellar: research, working demos, and the groundwork for a minimal passkey SDK with headless UI components and a `stellar-wallets-kit` adapter.

Stellar's Protocol 21 added native secp256r1 verification inside Soroban contracts, which means a passkey (Face ID, Touch ID, Windows Hello) can directly authorize on-chain transactions. No seed phrase, no browser extension, no custodian. This repo is where we prove that out end to end and document everything wallet developers need to ship it.

## What's Here

```
stellar-passkey/
├── apps/
│   ├── passkey-portal/    # Full passkey wallet demo on Stellar Testnet
│   └── webauthn-demo/     # WebAuthn learning app (protocol-level exploration)
├── docs/
│   ├── architecture.md            # How passkeys work on Stellar, SDK design, requirements
│   ├── compatibility-matrix.md    # Browser/OS/hardware support, tested on real devices
│   ├── usage-patterns.md          # Integration patterns and known issues
│   └── passkey-storage-and-sync.md # Where passkeys live and how they sync per platform
└── passkey_reading.md     # Curated study material and reference implementations
```

### apps/passkey-portal

A working passkey wallet on Stellar Testnet. Create a smart account secured by a passkey, fund it, check balances, and send XLM, all signed with a biometric prompt. Built with Next.js, [`smart-account-kit`](https://github.com/kalepail/smart-account-kit), and [OpenZeppelin stellar-contracts](https://github.com/OpenZeppelin/stellar-contracts).

```bash
cd apps/passkey-portal
npm install
cp .env.example .env.local   # set RPC URL, WASM hash, verifier address
npm run dev                  # http://localhost:3000
```

Passkeys require HTTPS or localhost, so the dev server works out of the box.

### apps/webauthn-demo

A protocol-level WebAuthn playground used to study registration and authentication ceremonies, credential encoding differences across browsers, and authenticator behavior before any Stellar integration.

```bash
cd apps/webauthn-demo
npm install
npm run dev
```

## Documentation

| Doc | What it covers |
|---|---|
| [Architecture](docs/architecture.md) | Passkey-on-Stellar flows, design considerations, SDK architecture, requirements |
| [Compatibility Matrix](docs/compatibility-matrix.md) | Browser × feature support, sync providers, hardware keys, known quirks |
| [Usage Patterns](docs/usage-patterns.md) | Quick start, integration patterns, error handling, recovery flows |
| [Storage & Sync](docs/passkey-storage-and-sync.md) | How iCloud Keychain, Google Password Manager, and hardware keys store passkeys |

## The Bigger Picture

The Stellar ecosystem has the hard parts solved at the contract level (OpenZeppelin verifiers, deployed and partially audited) and at the full-featured SDK level (smart-account-kit). What's missing is the minimal, approachable middle layer. The plan, detailed in [docs/architecture.md](docs/architecture.md):

- **`passkey-sdk`**: a thin SDK extracted from the reference implementations, covering the WebAuthn ceremony and Soroban signature payload construction with a narrow API
- **`passkey-ui`**: three headless Web Components (`<pk-create>`, `<pk-sign-tx>`, `<pk-recover>`) that manage the ceremony and emit typed events, with zero styling opinions
- **`wallets-kit-adapter`**: a [`@creit-tech/stellar-wallets-kit`](https://github.com/Creit-Tech/Stellar-Wallets-Kit) module so passkeys appear as a native wallet option alongside Freighter, Lobstr, and xBull

## License

MIT
