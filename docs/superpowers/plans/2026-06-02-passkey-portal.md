# Passkey Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished Next.js 16 App Router application that lets users create a Stellar smart account secured by a passkey, sign in, and access a gated dashboard with XLM transfer and RFP proposal viewing.

**Architecture:** Three screens (landing `/`, protected dashboard `/app`, transfer modal) backed by `smart-account-kit` for wallet lifecycle. A fee keypair in localStorage sponsors all on-chain transactions. Session state (contractId + credentialId) persists in localStorage with no server-side auth.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript, `smart-account-kit@^0.2`, `@stellar/stellar-sdk@^15`, `@simplewebauthn/browser@^13`

---

## File Map

| File | Responsibility |
|------|----------------|
| `package.json` | Deps + scripts |
| `next.config.ts` | ESM externals for smart-account-kit |
| `tsconfig.json` | Paths + strict TS |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin |
| `eslint.config.mjs` | Next.js ESLint |
| `.env.local` | Testnet env vars |
| `app/globals.css` | `@import "tailwindcss"` + CSS vars |
| `app/layout.tsx` | Root layout, dark bg, Geist font |
| `app/page.tsx` | Landing page — hero + two CTAs + feature bullets |
| `app/app/layout.tsx` | Auth guard — redirects to `/` if no session |
| `app/app/page.tsx` | Dashboard — wallet card + Dashboard/RFP tabs |
| `components/WalletCard.tsx` | Address display + copy button + XLM balance |
| `components/TransferModal.tsx` | XLM transfer form with passkey sign |
| `components/RFPViewer.tsx` | RFP markdown rendered as styled HTML |
| `lib/kit.ts` | `getKit()` — lazy SmartAccountKit factory |
| `lib/fee-account.ts` | Fee keypair creation, localStorage persistence, Friendbot funding |
| `lib/session.ts` | Session read/write/clear helpers |

---

## Task 1: Project scaffolding — config files

**Files:**
- Create: `apps/passkey-portal/package.json`
- Create: `apps/passkey-portal/next.config.ts`
- Create: `apps/passkey-portal/tsconfig.json`
- Create: `apps/passkey-portal/postcss.config.mjs`
- Create: `apps/passkey-portal/eslint.config.mjs`
- Create: `apps/passkey-portal/.env.local`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "passkey-portal",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@simplewebauthn/browser": "^13.3.0",
    "@simplewebauthn/types": "^12.0.0",
    "@stellar/stellar-sdk": "^15.0.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "smart-account-kit": "^0.2.10"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Create `next.config.ts`**

`smart-account-kit` is ESM-only; `transpilePackages` makes Next.js handle it correctly.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["smart-account-kit"],
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create `tsconfig.json`**

Mirror the sibling `webauthn-demo` exactly so module resolution is consistent.

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `postcss.config.mjs`**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Create `eslint.config.mjs`**

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

- [ ] **Step 6: Create `.env.local`**

```bash
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_ACCOUNT_WASM_HASH=8537b8166c0078440a5324c12f6db48d6340d157c306a54c5ea81405abcc2611
NEXT_PUBLIC_WEBAUTHN_VERIFIER_ADDRESS=CCMR63YE5T7MPWREF3PC5XNTTGXFSB4GYUGUIT5POHP2UGCS65TBIUUU
NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT=CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

- [ ] **Step 7: Run `npm install`**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey/apps/passkey-portal
npm install
```

Expected: `node_modules/` created, no errors. Lock file written.

- [ ] **Step 8: Commit**

```bash
git add apps/passkey-portal/package.json apps/passkey-portal/next.config.ts apps/passkey-portal/tsconfig.json apps/passkey-portal/postcss.config.mjs apps/passkey-portal/eslint.config.mjs apps/passkey-portal/.env.local
git commit -m "feat(passkey-portal): scaffold config and deps"
```

---

## Task 2: Global CSS and root layout

**Files:**
- Create: `apps/passkey-portal/app/globals.css`
- Create: `apps/passkey-portal/app/layout.tsx`

- [ ] **Step 1: Create `app/globals.css`**

Tailwind v4 uses a single import — no `@tailwind` directives.

```css
@import "tailwindcss";

:root {
  --background: #09090f;
  --foreground: #f8fafc;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 2: Create `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Passkey Portal',
  description: 'Your Stellar wallet, secured by passkey',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} font-[var(--font-geist)] antialiased`}
        style={{ background: 'var(--background)', color: 'var(--foreground)' }}
      >
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/passkey-portal/app/globals.css apps/passkey-portal/app/layout.tsx
git commit -m "feat(passkey-portal): global CSS and root layout"
```

---

## Task 3: Library — session helpers

**Files:**
- Create: `apps/passkey-portal/lib/session.ts`

Session shape: `{ contractId: string; credentialId: string }` stored under `passkey-portal:wallet`.

- [ ] **Step 1: Create `lib/session.ts`**

```typescript
const SESSION_KEY = 'passkey-portal:wallet'

export interface WalletSession {
  contractId: string
  credentialId: string
}

export function getSession(): WalletSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WalletSession
  } catch {
    return null
  }
}

export function setSession(session: WalletSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/lib/session.ts
git commit -m "feat(passkey-portal): session localStorage helpers"
```

---

## Task 4: Library — fee account management

**Files:**
- Create: `apps/passkey-portal/lib/fee-account.ts`

Manages a fee keypair in localStorage. On first call, generates a new keypair, persists the secret, funds it via Friendbot, and returns the `Keypair`.

- [ ] **Step 1: Create `lib/fee-account.ts`**

```typescript
import { Keypair } from '@stellar/stellar-sdk'

const FEE_SECRET_KEY = 'passkey-portal:fee-secret'
const FRIENDBOT_URL = 'https://friendbot.stellar.org'

export async function getOrCreateFeeKeypair(): Promise<Keypair> {
  const stored = localStorage.getItem(FEE_SECRET_KEY)
  if (stored) {
    return Keypair.fromSecret(stored)
  }

  const keypair = Keypair.random()
  localStorage.setItem(FEE_SECRET_KEY, keypair.secret())

  await fundViaFriendbot(keypair.publicKey())

  return keypair
}

async function fundViaFriendbot(publicKey: string): Promise<void> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`)
  if (!res.ok) {
    throw new Error(`Friendbot funding failed: ${res.status} ${res.statusText}`)
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/lib/fee-account.ts
git commit -m "feat(passkey-portal): fee keypair management and Friendbot funding"
```

---

## Task 5: Library — SmartAccountKit factory

**Files:**
- Create: `apps/passkey-portal/lib/kit.ts`

Returns a lazily-initialized `SmartAccountKit`. Must only be called client-side (inside event handlers or `useEffect`).

- [ ] **Step 1: Create `lib/kit.ts`**

```typescript
import { SmartAccountKit } from 'smart-account-kit'
import { IndexedDBStorage } from 'smart-account-kit/storage'
import type { Keypair } from '@stellar/stellar-sdk'

export async function getKit(deployerKeypair: Keypair): Promise<SmartAccountKit> {
  const kit = new SmartAccountKit({
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
    networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
    accountWasmHash: process.env.NEXT_PUBLIC_ACCOUNT_WASM_HASH!,
    webauthnVerifierAddress: process.env.NEXT_PUBLIC_WEBAUTHN_VERIFIER_ADDRESS!,
    storage: new IndexedDBStorage(),
    deployerKeypair,
  })
  return kit
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/lib/kit.ts
git commit -m "feat(passkey-portal): SmartAccountKit lazy factory"
```

---

## Task 6: Landing page (`/`)

**Files:**
- Create: `apps/passkey-portal/app/page.tsx`

Full-screen hero with two glass-card CTAs (Create Wallet, Sign In) and three feature bullets. All wallet interactions are lazy-initialized inside handlers.

- [ ] **Step 1: Create `app/page.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getOrCreateFeeKeypair } from '@/lib/fee-account'
import { getKit } from '@/lib/kit'
import { setSession, getSession } from '@/lib/session'

const FRIENDLY_ERRORS: Record<string, string> = {
  NotAllowedError: 'Cancelled — try again',
  InvalidStateError: 'Already registered — use Sign In instead',
  SecurityError: 'Requires HTTPS or localhost',
  NotSupportedError: 'Passkeys not supported in this browser',
  AbortError: 'Request was aborted',
}

function toFriendlyError(err: unknown): string {
  if (err instanceof Error) {
    return FRIENDLY_ERRORS[err.name] ?? err.message
  }
  return 'Unknown error'
}

export default function LandingPage() {
  const router = useRouter()
  const [createStatus, setCreateStatus] = useState<'idle' | 'pending' | 'error'>('idle')
  const [signInStatus, setSignInStatus] = useState<'idle' | 'pending' | 'error'>('idle')
  const [createError, setCreateError] = useState<string | null>(null)
  const [signInError, setSignInError] = useState<string | null>(null)

  async function handleCreateWallet() {
    setCreateStatus('pending')
    setCreateError(null)
    try {
      const feeKeypair = await getOrCreateFeeKeypair()
      const kit = await getKit(feeKeypair)
      const { contractId, credentialId } = await kit.createWallet()
      setSession({ contractId, credentialId })
      router.push('/app')
    } catch (err) {
      setCreateError(toFriendlyError(err))
      setCreateStatus('error')
    }
  }

  async function handleSignIn() {
    setSignInStatus('pending')
    setSignInError(null)
    try {
      const session = getSession()
      if (!session) {
        setSignInError('No wallet found — create one first')
        setSignInStatus('error')
        return
      }
      const feeKeypair = await getOrCreateFeeKeypair()
      const kit = await getKit(feeKeypair)
      await kit.connectWallet({ contractId: session.contractId, credentialId: session.credentialId })
      router.push('/app')
    } catch (err) {
      setSignInError(toFriendlyError(err))
      setSignInStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden" style={{ background: '#09090f' }}>
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-2xl">
        {/* Hero text */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            Passkey Portal
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Your Stellar wallet, secured by passkey
          </p>
          <p className="text-slate-500">
            No seed phrases. No extensions. Just your fingerprint.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Create Wallet */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Create Wallet</h2>
              <p className="text-sm text-slate-400">
                Register a new Stellar smart account secured by your device biometrics.
              </p>
            </div>
            {createError && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{createError}</p>
            )}
            <button
              onClick={handleCreateWallet}
              disabled={createStatus === 'pending'}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {createStatus === 'pending' ? 'Creating…' : 'Create Wallet'}
            </button>
          </div>

          {/* Sign In */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Sign In</h2>
              <p className="text-sm text-slate-400">
                Authenticate with your existing passkey to access your wallet.
              </p>
            </div>
            {signInError && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{signInError}</p>
            )}
            <button
              onClick={handleSignIn}
              disabled={signInStatus === 'pending'}
              className="w-full py-2.5 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {signInStatus === 'pending' ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="flex flex-col md:flex-row gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm font-medium text-slate-300">Phishing-resistant</span>
            <span className="text-xs text-slate-500">Cryptographically bound to this domain</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🔄</span>
            <span className="text-sm font-medium text-slate-300">Synced across devices</span>
            <span className="text-xs text-slate-500">iCloud Keychain & Google Password Manager</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-medium text-slate-300">No seed phrases</span>
            <span className="text-xs text-slate-500">Your biometric IS your key</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/app/page.tsx
git commit -m "feat(passkey-portal): landing page with create wallet and sign in CTAs"
```

---

## Task 7: WalletCard component

**Files:**
- Create: `apps/passkey-portal/components/WalletCard.tsx`

Displays truncated wallet address with copy button and XLM balance. Receives props — no internal data fetching.

- [ ] **Step 1: Create `components/WalletCard.tsx`**

```typescript
'use client'

import { useState } from 'react'

interface WalletCardProps {
  contractId: string
  balance: string | null
  loading: boolean
}

function truncate(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`
}

export function WalletCard({ contractId, balance, loading }: WalletCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(contractId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="relative rounded-2xl p-px bg-gradient-to-r from-violet-600 to-indigo-600">
      <div className="rounded-2xl bg-[#0d0d1a] p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Wallet</span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-400">Testnet</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400 flex-1 truncate">{contractId}</span>
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div>
          <span className="text-xs text-slate-500 block mb-1">Balance</span>
          {loading ? (
            <div className="h-8 w-32 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <span className="text-3xl font-bold text-white">
              {balance ?? '—'} <span className="text-lg text-slate-400">XLM</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/components/WalletCard.tsx
git commit -m "feat(passkey-portal): WalletCard component"
```

---

## Task 8: TransferModal component

**Files:**
- Create: `apps/passkey-portal/components/TransferModal.tsx`

Modal overlay with recipient address + amount inputs. On submit, calls `onTransfer` prop which is responsible for the passkey+chain interaction. Shows loading/error states.

- [ ] **Step 1: Create `components/TransferModal.tsx`**

```typescript
'use client'

import { useState } from 'react'

interface TransferModalProps {
  onClose: () => void
  onTransfer: (recipient: string, amount: string) => Promise<void>
}

export function TransferModal({ onClose, onTransfer }: TransferModalProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('pending')
    setError(null)
    try {
      await onTransfer(recipient, amount)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed')
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-[#0d0d1a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Send XLM</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold">Transfer submitted</p>
            <p className="text-slate-400 text-sm mt-1">Transaction signed and sent</p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="G… or C…"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Amount (XLM)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.0000001"
                step="any"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'pending'}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {status === 'pending' ? 'Signing with passkey…' : '✦ Sign with Passkey'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/components/TransferModal.tsx
git commit -m "feat(passkey-portal): TransferModal component"
```

---

## Task 9: RFPViewer component

**Files:**
- Create: `apps/passkey-portal/components/RFPViewer.tsx`

Renders the RFP proposal as styled HTML. The content is inlined as a constant string to avoid file system imports at runtime. Tables, headings, code blocks all styled to match the dark theme.

- [ ] **Step 1: Create `components/RFPViewer.tsx`**

The component uses `dangerouslySetInnerHTML` with pre-converted HTML. The RFP markdown is converted to HTML inline in the component (no markdown parser dependency). Key sections are rendered as semantic HTML.

```typescript
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
```

- [ ] **Step 2: Add `<style>` for RFP content in `app/globals.css`**

Append to the existing `app/globals.css`:

```css
/* RFP viewer prose styles */
.rfp-content h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  margin-top: 0;
}

.rfp-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.rfp-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.rfp-content p {
  color: #94a3b8;
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.rfp-content ul,
.rfp-content ol {
  color: #94a3b8;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.rfp-content li {
  margin-bottom: 0.25rem;
  line-height: 1.6;
}

.rfp-content strong {
  color: #e2e8f0;
  font-weight: 600;
}

.rfp-content pre {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.rfp-content code {
  font-family: var(--font-mono), monospace;
  font-size: 0.875rem;
  color: #a5b4fc;
}

.rfp-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.rfp-content th {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-weight: 600;
  text-align: left;
  padding: 0.625rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rfp-content td {
  color: #94a3b8;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: top;
}

.rfp-content tr:nth-child(even) td {
  background: rgba(255, 255, 255, 0.02);
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/passkey-portal/components/RFPViewer.tsx apps/passkey-portal/app/globals.css
git commit -m "feat(passkey-portal): RFPViewer component and prose styles"
```

---

## Task 10: Protected layout (`/app/layout.tsx`)

**Files:**
- Create: `apps/passkey-portal/app/app/layout.tsx`

Auth guard: reads session from localStorage on mount. If missing, redirects to `/`. Shows a loading state during the check to avoid flash-of-unauthenticated-content.

- [ ] **Step 1: Create `app/app/layout.tsx`**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/session'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/')
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090f' }}>
        <div className="w-8 h-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/app/app/layout.tsx
git commit -m "feat(passkey-portal): protected /app layout with auth guard"
```

---

## Task 11: Dashboard page (`/app/page.tsx`)

**Files:**
- Create: `apps/passkey-portal/app/app/page.tsx`

Dashboard with: top bar (app name + Disconnect), WalletCard, two tabs (Dashboard | RFP Proposal), Send XLM button triggering TransferModal. Fetches XLM balance via `@stellar/stellar-sdk` Horizon.

- [ ] **Step 1: Create `app/app/page.tsx`**

```typescript
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Horizon } from '@stellar/stellar-sdk'
import { WalletCard } from '@/components/WalletCard'
import { TransferModal } from '@/components/TransferModal'
import { RFPViewer } from '@/components/RFPViewer'
import { getSession, clearSession } from '@/lib/session'
import { getOrCreateFeeKeypair } from '@/lib/fee-account'
import { getKit } from '@/lib/kit'

type Tab = 'dashboard' | 'rfp'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const NATIVE_CONTRACT = process.env.NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT!

export default function AppPage() {
  const router = useRouter()
  const [contractId, setContractId] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showTransfer, setShowTransfer] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session) setContractId(session.contractId)
  }, [])

  const fetchBalance = useCallback(async (addr: string) => {
    setBalanceLoading(true)
    try {
      const server = new Horizon.Server(HORIZON_URL)
      const account = await server.loadAccount(addr)
      const native = account.balances.find((b) => b.asset_type === 'native')
      setBalance(native ? parseFloat(native.balance).toFixed(2) : '0.00')
    } catch {
      setBalance('—')
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  useEffect(() => {
    if (contractId) fetchBalance(contractId)
  }, [contractId, fetchBalance])

  function handleDisconnect() {
    clearSession()
    router.replace('/')
  }

  async function handleTransfer(recipient: string, amount: string): Promise<void> {
    const feeKeypair = await getOrCreateFeeKeypair()
    const kit = await getKit(feeKeypair)
    const session = getSession()
    if (!session) throw new Error('Session expired')

    await kit.connectWallet({ contractId: session.contractId, credentialId: session.credentialId })

    await kit.transfer({
      to: recipient,
      amount,
      tokenAddress: NATIVE_CONTRACT,
    })

    if (contractId) await fetchBalance(contractId)
  }

  if (!contractId) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#09090f' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
        <span className="text-lg font-semibold text-white">Passkey Portal</span>
        <button
          onClick={handleDisconnect}
          className="text-sm px-4 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
        >
          Disconnect
        </button>
      </header>

      <main className="flex-1 px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">
        {/* Wallet card */}
        <div className="mb-8">
          <WalletCard contractId={contractId} balance={balance} loading={balanceLoading} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('rfp')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'rfp'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RFP Proposal
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'dashboard' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2">Balance</span>
              {balanceLoading ? (
                <div className="h-10 w-40 bg-white/5 rounded-lg animate-pulse" />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {balance ?? '—'} <span className="text-xl text-slate-400">XLM</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowTransfer(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all text-sm"
              >
                Send XLM
              </button>
              <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-slate-400">
                Testnet
              </span>
            </div>
          </div>
        )}

        {activeTab === 'rfp' && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
            <RFPViewer />
          </div>
        )}
      </main>

      {showTransfer && (
        <TransferModal
          onClose={() => setShowTransfer(false)}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/passkey-portal/app/app/page.tsx
git commit -m "feat(passkey-portal): dashboard page with tabs and transfer modal"
```

---

## Task 12: Run `npm install` and verify

**Files:** none (verification only)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey/apps/passkey-portal
npm install
```

Expected: All packages resolve. No `ERESOLVE` errors. `node_modules/smart-account-kit` exists.

- [ ] **Step 2: Verify `smart-account-kit` exports are accessible**

```bash
node -e "const { SmartAccountKit } = require('./node_modules/smart-account-kit/dist/index.js'); console.log(typeof SmartAccountKit)"
```

Expected output: `function`

- [ ] **Step 3: Verify `next-env.d.ts` gets created on next build check**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey/apps/passkey-portal
npx next build --dry-run 2>&1 | head -20 || npx tsc --noEmit 2>&1 | head -30
```

Note: Some type errors from `smart-account-kit` API surface may appear if the SDK's constructor signature differs from what's in `lib/kit.ts`. If so, adjust the constructor call in Task 5's `lib/kit.ts` to match the actual SDK types.

- [ ] **Step 4: Commit final state**

```bash
git add apps/passkey-portal/
git commit -m "feat(passkey-portal): complete app scaffold — all files created"
```

---

## Self-Review Notes

**Spec coverage check:**

| Requirement | Task |
|-------------|------|
| package.json with all deps | Task 1 |
| next.config.ts with transpilePackages | Task 1 |
| tsconfig.json matching sibling | Task 1 |
| postcss.config.mjs for Tailwind v4 | Task 1 |
| eslint.config.mjs | Task 1 |
| .env.local with 5 vars | Task 1 |
| app/globals.css `@import "tailwindcss"` | Task 2 |
| app/layout.tsx with Geist font | Task 2 |
| lib/session.ts | Task 3 |
| lib/fee-account.ts with Friendbot | Task 4 |
| lib/kit.ts lazy factory | Task 5 |
| app/page.tsx landing hero + CTAs + bullets | Task 6 |
| components/WalletCard.tsx | Task 7 |
| components/TransferModal.tsx | Task 8 |
| components/RFPViewer.tsx | Task 9 |
| RFP CSS prose styles | Task 9 |
| app/app/layout.tsx auth guard | Task 10 |
| app/app/page.tsx dashboard | Task 11 |
| npm install | Task 12 |

**Fee approach (Option 4):** ✅ — `lib/fee-account.ts` generates keypair, stores secret in localStorage, funds via Friendbot.

**SmartAccountKit lazy init:** ✅ — `getKit()` is only called inside event handlers in `page.tsx` and `app/app/page.tsx`, never at module level.

**'use client' on all interactive components:** ✅ — all components and pages using state/events/localStorage are marked.

**Tailwind v4 import pattern:** ✅ — `@import "tailwindcss"` only, no `@tailwind` directives.

**Design system colors:** ✅ — `#09090f` bg, `from-violet-600 to-indigo-600` gradient, `bg-white/5 backdrop-blur-xl border border-white/10` cards.
