# WebAuthn Learning App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 15 web app that lets you register and authenticate with a passkey, trigger the cross-device QR flow, and inspect every raw WebAuthn object the browser produces.

**Architecture:** Single-page client-side app. No backend. All WebAuthn ceremonies run in the browser using `@simplewebauthn/browser`. The challenge is generated via `crypto.getRandomValues()`. A two-column layout puts action buttons on the left and a live decoded-response panel on the right.

**Tech Stack:** Next.js 15 (App Router), TypeScript, `@simplewebauthn/browser v13`, `cbor-x`, Tailwind CSS v3.

**Spec:** `docs/superpowers/specs/2026-06-01-webauthn-learning-app-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `apps/webauthn-demo/app/layout.tsx` | Root layout, Tailwind font setup |
| `apps/webauthn-demo/app/globals.css` | Tailwind directives |
| `apps/webauthn-demo/app/page.tsx` | State owner; wires ActionPanel ↔ InspectionPanel |
| `apps/webauthn-demo/components/ActionPanel.tsx` | Three action buttons with status indicators |
| `apps/webauthn-demo/components/InspectionPanel.tsx` | Decoded response viewer; switches between registration/auth views |
| `apps/webauthn-demo/components/DecodedAuthData.tsx` | Renders each authData byte-range as a labelled row |
| `apps/webauthn-demo/lib/types.ts` | All shared TypeScript types |
| `apps/webauthn-demo/lib/challenge.ts` | `generateChallenge()` and `toBase64URL()` helpers |
| `apps/webauthn-demo/lib/decode.ts` | `parseAuthData()`, `decodeCoseKey()`, `decodeClientDataJSON()`, `base64URLToBuffer()` |

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: `apps/webauthn-demo/` (entire directory via CLI)

- [ ] **Step 1: Run create-next-app**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
npx create-next-app@latest apps/webauthn-demo \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-git
```

When prompted, accept all defaults.

Expected: `apps/webauthn-demo/` created with `app/`, `components/` (empty), `public/`, `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`.

- [ ] **Step 2: Install additional dependencies**

```bash
cd apps/webauthn-demo
npm install @simplewebauthn/browser@^13 @simplewebauthn/types@^13 cbor-x@^1.6
```

Expected: `node_modules/@simplewebauthn` and `node_modules/cbor-x` present.

- [ ] **Step 3: Clear boilerplate from app/page.tsx**

Replace the entire file with:

```tsx
export default function Page() {
  return <main>WebAuthn Demo</main>
}
```

- [ ] **Step 4: Clear boilerplate from app/globals.css**

Replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on `http://localhost:3000`, browser shows "WebAuthn Demo". No TypeScript errors in terminal.

- [ ] **Step 6: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo
git commit -m "feat: scaffold Next.js 15 WebAuthn demo app"
```

---

## Task 2: Define shared TypeScript types

**Files:**
- Create: `apps/webauthn-demo/lib/types.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```bash
mkdir -p apps/webauthn-demo/lib
```

Write `apps/webauthn-demo/lib/types.ts`:

```typescript
export type ParsedAuthData = {
  rpIdHash: string
  flagsByte: number
  flags: {
    UP: boolean   // user present
    UV: boolean   // user verified
    BE: boolean   // backup eligible (passkey can sync)
    BS: boolean   // backup state (passkey is currently synced)
    AT: boolean   // attested credential data present (registration only)
  }
  signCount: number
  // only present when AT flag is set (registration responses)
  aaguid?: string
  credentialId?: string
  coseKeyBytes?: Uint8Array
}

export type CoseKey = {
  alg: number    // -7 = ES256/P-256, the algorithm Soroban uses
  x: string      // hex — the public key x coordinate
  y: string      // hex — the public key y coordinate
}

export type DecodedClientDataJSON = {
  type: string
  challenge: string
  origin: string
  crossOrigin: boolean
}

export type DecodedRegistration = {
  credentialId: string
  clientDataJSON: DecodedClientDataJSON
  authData: ParsedAuthData
  coseKey: CoseKey
  publicKeyAlgorithm: number
  transports: string[]
}

export type DecodedAuthentication = {
  credentialId: string
  clientDataJSON: DecodedClientDataJSON
  authData: ParsedAuthData
  signature: string      // hex — the P-256 signature secp256r1_verify() checks
  userHandle: string | null
}

export type ActiveView = 'registration' | 'authentication' | null
export type ActionStatus = 'idle' | 'pending' | 'success' | 'error'
export type ActionKey = 'register' | 'authenticate' | 'crossDevice'
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
cd apps/webauthn-demo
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/lib/types.ts
git commit -m "feat: add shared WebAuthn types"
```

---

## Task 3: Challenge generation utilities

**Files:**
- Create: `apps/webauthn-demo/lib/challenge.ts`

- [ ] **Step 1: Write `lib/challenge.ts`**

```typescript
export function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32))
}

export function toBase64URL(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/webauthn-demo && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/lib/challenge.ts
git commit -m "feat: add challenge generation utilities"
```

---

## Task 4: AuthData decoder and COSE key parser

**Files:**
- Create: `apps/webauthn-demo/lib/decode.ts`

This is the most important file — it turns raw base64url-encoded WebAuthn fields into human-readable objects.

- [ ] **Step 1: Write `lib/decode.ts`**

```typescript
import { decode as cborDecode } from 'cbor-x'
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types'
import type {
  CoseKey,
  DecodedAuthentication,
  DecodedClientDataJSON,
  DecodedRegistration,
  ParsedAuthData,
} from './types'

// ── Base64URL helpers ────────────────────────────────────────────────────────

export function base64URLToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

export function toHex(bytes: Uint8Array | ArrayBuffer): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// ── clientDataJSON ───────────────────────────────────────────────────────────

export function decodeClientDataJSON(base64url: string): DecodedClientDataJSON {
  const json = JSON.parse(new TextDecoder().decode(base64URLToBuffer(base64url)))
  return {
    type: json.type,
    challenge: json.challenge,
    origin: json.origin,
    crossOrigin: json.crossOrigin ?? false,
  }
}

// ── authenticatorData ────────────────────────────────────────────────────────

export function parseAuthData(buffer: ArrayBuffer): ParsedAuthData {
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)

  const rpIdHash = toHex(bytes.slice(0, 32))
  const flagsByte = bytes[32]
  const flags = {
    UP: !!(flagsByte & 0x01),
    UV: !!(flagsByte & 0x04),
    BE: !!(flagsByte & 0x08),
    BS: !!(flagsByte & 0x10),
    AT: !!(flagsByte & 0x40),
  }
  const signCount = view.getUint32(33, false) // big-endian

  if (!flags.AT || bytes.length <= 37) {
    return { rpIdHash, flagsByte, flags, signCount }
  }

  const aaguidBytes = bytes.slice(37, 53)
  const aaguid = formatAaguid(aaguidBytes)

  const credIdLen = view.getUint16(53, false)
  const credentialIdBytes = bytes.slice(55, 55 + credIdLen)
  const credentialId = btoa(String.fromCharCode(...credentialIdBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  const coseKeyBytes = bytes.slice(55 + credIdLen)

  return { rpIdHash, flagsByte, flags, signCount, aaguid, credentialId, coseKeyBytes }
}

function formatAaguid(bytes: Uint8Array): string {
  const h = toHex(bytes)
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// ── COSE public key ──────────────────────────────────────────────────────────

export function decodeCoseKey(cborBytes: Uint8Array): CoseKey {
  const map = cborDecode(cborBytes) as Map<number, unknown>
  const get = (k: number) => (map instanceof Map ? map.get(k) : (map as Record<number, unknown>)[k])
  const alg = (get(3) as number) ?? -7
  const x = get(-2) as Uint8Array
  const y = get(-3) as Uint8Array
  return { alg, x: toHex(x), y: toHex(y) }
}

// ── High-level decoders ──────────────────────────────────────────────────────

export function decodeRegistration(response: RegistrationResponseJSON): DecodedRegistration {
  const clientDataJSON = decodeClientDataJSON(response.response.clientDataJSON)

  // Use authenticatorData directly if the browser provided it (modern browsers),
  // otherwise extract from the attestationObject CBOR.
  let authDataBuffer: ArrayBuffer
  if (response.response.authenticatorData) {
    authDataBuffer = base64URLToBuffer(response.response.authenticatorData)
  } else {
    const attestation = cborDecode(
      new Uint8Array(base64URLToBuffer(response.response.attestationObject)),
    ) as { authData: Uint8Array }
    authDataBuffer = attestation.authData.buffer
  }

  const authData = parseAuthData(authDataBuffer)
  const coseKey = authData.coseKeyBytes
    ? decodeCoseKey(authData.coseKeyBytes)
    : { alg: -7, x: '', y: '' }

  return {
    credentialId: response.id,
    clientDataJSON,
    authData,
    coseKey,
    publicKeyAlgorithm: response.response.publicKeyAlgorithm ?? -7,
    transports: response.response.transports ?? [],
  }
}

export function decodeAuthentication(response: AuthenticationResponseJSON): DecodedAuthentication {
  const clientDataJSON = decodeClientDataJSON(response.response.clientDataJSON)
  const authData = parseAuthData(base64URLToBuffer(response.response.authenticatorData))
  const signature = toHex(new Uint8Array(base64URLToBuffer(response.response.signature)))
  const userHandle = response.response.userHandle ?? null

  return {
    credentialId: response.id,
    clientDataJSON,
    authData,
    signature,
    userHandle,
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/webauthn-demo && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/lib/decode.ts
git commit -m "feat: add authData parser and COSE key decoder"
```

---

## Task 5: `DecodedAuthData` component

**Files:**
- Create: `apps/webauthn-demo/components/DecodedAuthData.tsx`

- [ ] **Step 1: Write `DecodedAuthData.tsx`**

```tsx
import type { ParsedAuthData } from '@/lib/types'

type Props = {
  authData: ParsedAuthData
}

export function DecodedAuthData({ authData }: Props) {
  const { rpIdHash, flagsByte, flags, signCount, aaguid, credentialId } = authData

  return (
    <div className="space-y-1 font-mono text-xs">
      <Row label="rpIdHash" value={rpIdHash} note="SHA-256 of the origin hostname" />
      <Row
        label="flags"
        value={`0x${flagsByte.toString(16).padStart(2, '0')} (${flagsByte.toString(2).padStart(8, '0')})`}
        note=""
      />
      <div className="pl-4 space-y-0.5 text-slate-500">
        <FlagRow name="UP" value={flags.UP} note="user present" />
        <FlagRow name="UV" value={flags.UV} note="user verified" />
        <FlagRow name="BE" value={flags.BE} note="backup eligible — passkey can sync" />
        <FlagRow name="BS" value={flags.BS} note="backup state — currently synced" />
        <FlagRow name="AT" value={flags.AT} note="attested credential data present" />
      </div>
      <Row label="signCount" value={String(signCount)} note="increments on each authentication" />
      {aaguid && <Row label="AAGUID" value={aaguid} note="authenticator model identifier" />}
      {credentialId && (
        <Row label="credentialId" value={credentialId} note="base64url — stored in localStorage" />
      )}
    </div>
  )
}

function Row({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
      <span className="text-slate-400 shrink-0">{label}</span>
      <div>
        <span className="text-green-400 break-all">{value}</span>
        {note && <span className="text-slate-500 ml-2 text-[10px]">// {note}</span>}
      </div>
    </div>
  )
}

function FlagRow({ name, value, note }: { name: string; value: boolean; note: string }) {
  return (
    <div className="grid grid-cols-[40px_16px_1fr] gap-1">
      <span>{name}</span>
      <span className={value ? 'text-green-400' : 'text-slate-600'}>{value ? '1' : '0'}</span>
      <span className="text-slate-600">// {note}</span>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/webauthn-demo && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/components/DecodedAuthData.tsx
git commit -m "feat: add DecodedAuthData component"
```

---

## Task 6: `InspectionPanel` component

**Files:**
- Create: `apps/webauthn-demo/components/InspectionPanel.tsx`

- [ ] **Step 1: Write `InspectionPanel.tsx`**

```tsx
import { DecodedAuthData } from './DecodedAuthData'
import type { ActiveView, DecodedAuthentication, DecodedRegistration } from '@/lib/types'

type Props = {
  activeView: ActiveView
  registration: DecodedRegistration | null
  authentication: DecodedAuthentication | null
}

export function InspectionPanel({ activeView, registration, authentication }: Props) {
  if (!activeView) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm">
        Perform a ceremony on the left to inspect the WebAuthn response.
      </div>
    )
  }

  return (
    <div className="overflow-y-auto h-full space-y-6 p-6 bg-slate-900 text-sm">
      {activeView === 'registration' && registration && (
        <RegistrationView data={registration} />
      )}
      {activeView === 'authentication' && authentication && (
        <AuthenticationView data={authentication} />
      )}
    </div>
  )
}

function RegistrationView({ data }: { data: DecodedRegistration }) {
  return (
    <>
      <Section title="clientDataJSON" note='type: "webauthn.create"'>
        <KVRow k="type" v={data.clientDataJSON.type} />
        <KVRow k="challenge" v={data.clientDataJSON.challenge} note="random 32 bytes (base64url)" />
        <KVRow k="origin" v={data.clientDataJSON.origin} />
        <KVRow k="crossOrigin" v={String(data.clientDataJSON.crossOrigin)} />
      </Section>

      <Section title="authenticatorData">
        <DecodedAuthData authData={data.authData} />
      </Section>

      <Section
        title="COSE Public Key"
        note={`alg ${data.coseKey.alg} = ${data.coseKey.alg === -7 ? 'ES256 / P-256 (secp256r1)' : data.coseKey.alg === -35 ? 'ES384' : String(data.coseKey.alg)}`}
      >
        <KVRow k="alg" v={String(data.coseKey.alg)} note="stored in the Soroban contract" />
        <KVRow k="x" v={data.coseKey.x} note="public key x coordinate" />
        <KVRow k="y" v={data.coseKey.y} note="public key y coordinate" />
      </Section>

      <Section title="Metadata">
        <KVRow k="credentialId" v={data.credentialId} />
        <KVRow k="publicKeyAlgorithm" v={String(data.publicKeyAlgorithm)} />
        <KVRow k="transports" v={data.transports.join(', ') || '(none reported)'} />
      </Section>
    </>
  )
}

function AuthenticationView({ data }: { data: DecodedAuthentication }) {
  return (
    <>
      <Section title="clientDataJSON" note='type: "webauthn.get"'>
        <KVRow k="type" v={data.clientDataJSON.type} />
        <KVRow
          k="challenge"
          v={data.clientDataJSON.challenge}
          note="in Stellar: this would be the transaction signature_payload"
        />
        <KVRow k="origin" v={data.clientDataJSON.origin} />
      </Section>

      <Section title="authenticatorData" note="signCount increments each authentication">
        <DecodedAuthData authData={data.authData} />
      </Section>

      <Section
        title="signature"
        note="DER-encoded P-256 sig — this is what secp256r1_verify() checks on-chain"
      >
        <p className="font-mono text-xs text-green-400 break-all">{data.signature}</p>
      </Section>

      {data.userHandle && (
        <Section title="userHandle">
          <p className="font-mono text-xs text-green-400">{data.userHandle}</p>
        </Section>
      )}
    </>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-white font-semibold">{title}</h3>
        {note && <span className="text-slate-500 text-xs">{note}</span>}
      </div>
      <div className="pl-3 border-l border-slate-700 space-y-1">{children}</div>
    </div>
  )
}

function KVRow({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 items-start font-mono text-xs">
      <span className="text-slate-400 shrink-0">{k}</span>
      <div>
        <span className="text-green-400 break-all">{v}</span>
        {note && <span className="text-slate-500 ml-2 text-[10px]">// {note}</span>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/webauthn-demo && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/components/InspectionPanel.tsx
git commit -m "feat: add InspectionPanel component"
```

---

## Task 7: `ActionPanel` component

**Files:**
- Create: `apps/webauthn-demo/components/ActionPanel.tsx`

- [ ] **Step 1: Write `ActionPanel.tsx`**

```tsx
'use client'

import type { ActionKey, ActionStatus } from '@/lib/types'

type Props = {
  credentialId: string | null
  status: Record<ActionKey, ActionStatus>
  errorMessage: Record<ActionKey, string | null>
  onRegister: () => void
  onAuthenticate: () => void
  onCrossDevice: () => void
}

export function ActionPanel({
  credentialId,
  status,
  errorMessage,
  onRegister,
  onAuthenticate,
  onCrossDevice,
}: Props) {
  return (
    <div className="p-6 space-y-8">
      <ActionSection
        title="1. Register"
        description="Creates a new P-256 keypair on your device. The public key would be stored in the Soroban contract."
        buttonLabel="Register Passkey"
        status={status.register}
        errorMessage={errorMessage.register}
        successDetail={credentialId ? `Credential ID saved to localStorage` : null}
        disabled={status.register === 'pending'}
        onClick={onRegister}
      />

      <ActionSection
        title="2. Authenticate"
        description="Signs a random challenge with your passkey. In Stellar, the challenge is the transaction signature_payload."
        buttonLabel="Authenticate"
        status={status.authenticate}
        errorMessage={errorMessage.authenticate}
        successDetail="Signature produced — see inspection panel"
        disabled={!credentialId || status.authenticate === 'pending'}
        disabledReason={!credentialId ? 'Register first' : undefined}
        onClick={onAuthenticate}
      />

      <ActionSection
        title="3. Cross-Device QR"
        description="No allowCredentials restriction — browser shows its native picker including the QR / nearby-device option (CTAP2 hybrid transport)."
        buttonLabel="Show Cross-Device Options"
        status={status.crossDevice}
        errorMessage={errorMessage.crossDevice}
        successDetail="Authenticated via cross-device flow"
        disabled={status.crossDevice === 'pending'}
        onClick={onCrossDevice}
      />

      {credentialId && (
        <div className="pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 font-mono">
            stored credential: <span className="text-slate-300 break-all">{credentialId}</span>
          </p>
        </div>
      )}
    </div>
  )
}

type ActionSectionProps = {
  title: string
  description: string
  buttonLabel: string
  status: ActionStatus
  errorMessage: string | null
  successDetail: string | null
  disabled: boolean
  disabledReason?: string
  onClick: () => void
}

function ActionSection({
  title,
  description,
  buttonLabel,
  status,
  errorMessage,
  successDetail,
  disabled,
  disabledReason,
  onClick,
}: ActionSectionProps) {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="text-slate-400 text-sm">{description}</p>
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-4 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'pending' ? (
          <span className="flex items-center gap-2">
            <Spinner /> Working…
          </span>
        ) : (
          buttonLabel
        )}
      </button>
      {disabledReason && status === 'idle' && (
        <p className="text-xs text-slate-500">{disabledReason}</p>
      )}
      <StatusRow status={status} errorMessage={errorMessage} successDetail={successDetail} />
    </div>
  )
}

function StatusRow({
  status,
  errorMessage,
  successDetail,
}: {
  status: ActionStatus
  errorMessage: string | null
  successDetail: string | null
}) {
  if (status === 'idle') return null
  if (status === 'pending') return <p className="text-xs text-slate-400">Waiting for browser…</p>
  if (status === 'error')
    return <p className="text-xs text-red-400">{errorMessage ?? 'Unknown error'}</p>
  if (status === 'success')
    return <p className="text-xs text-green-400">{successDetail}</p>
  return null
}

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd apps/webauthn-demo && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/components/ActionPanel.tsx
git commit -m "feat: add ActionPanel component"
```

---

## Task 8: Wire `app/page.tsx` and verify all flows

**Files:**
- Modify: `apps/webauthn-demo/app/page.tsx`
- Modify: `apps/webauthn-demo/app/layout.tsx`

- [ ] **Step 1: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import './globals.css'

const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'WebAuthn Learning App',
  description: 'Inspect raw WebAuthn passkey responses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${mono.variable} bg-slate-950 text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Write `app/page.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { ActionPanel } from '@/components/ActionPanel'
import { InspectionPanel } from '@/components/InspectionPanel'
import { generateChallenge, toBase64URL } from '@/lib/challenge'
import { decodeAuthentication, decodeRegistration } from '@/lib/decode'
import type {
  ActionKey,
  ActionStatus,
  ActiveView,
  DecodedAuthentication,
  DecodedRegistration,
} from '@/lib/types'

const STORAGE_KEY = 'webauthn-demo-credential-id'

const FRIENDLY_ERRORS: Record<string, string> = {
  NotAllowedError: 'Cancelled or timed out — try again',
  InvalidStateError: 'Already registered — use Authenticate instead',
  SecurityError: 'Security error — check you are on localhost or HTTPS',
  NotSupportedError: 'Passkeys not supported in this browser',
  AbortError: 'Request was aborted',
}

function friendlyError(name: string): string {
  return FRIENDLY_ERRORS[name] ?? `${name} — check browser console for details`
}

export default function Page() {
  const [credentialId, setCredentialId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<ActiveView>(null)
  const [registration, setRegistration] = useState<DecodedRegistration | null>(null)
  const [authentication, setAuthentication] = useState<DecodedAuthentication | null>(null)

  const [status, setStatus] = useState<Record<ActionKey, ActionStatus>>({
    register: 'idle',
    authenticate: 'idle',
    crossDevice: 'idle',
  })
  const [errorMessage, setErrorMessage] = useState<Record<ActionKey, string | null>>({
    register: null,
    authenticate: null,
    crossDevice: null,
  })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setCredentialId(stored)
  }, [])

  function setActionStatus(action: ActionKey, s: ActionStatus, err?: string) {
    setStatus((prev) => ({ ...prev, [action]: s }))
    setErrorMessage((prev) => ({ ...prev, [action]: err ?? null }))
  }

  async function handleRegister() {
    setActionStatus('register', 'pending')
    try {
      const result: RegistrationResponseJSON = await startRegistration({
        optionsJSON: {
          challenge: toBase64URL(generateChallenge()),
          rp: { name: 'WebAuthn Demo', id: window.location.hostname },
          user: {
            id: toBase64URL(crypto.getRandomValues(new Uint8Array(16))),
            name: 'demo@localhost',
            displayName: 'Demo User',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256 / P-256
            { type: 'public-key', alg: -35 },  // ES384 fallback for some Android
          ],
          timeout: 60000,
          attestation: 'none',
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            residentKey: 'preferred',
            userVerification: 'preferred',
          },
        },
      })
      const decoded = decodeRegistration(result)
      setRegistration(decoded)
      setActiveView('registration')
      setCredentialId(result.id)
      localStorage.setItem(STORAGE_KEY, result.id)
      setActionStatus('register', 'success')
    } catch (err) {
      const name = err instanceof Error ? err.name : 'UnknownError'
      setActionStatus('register', 'error', friendlyError(name))
    }
  }

  async function handleAuthenticate() {
    if (!credentialId) return
    setActionStatus('authenticate', 'pending')
    try {
      const result: AuthenticationResponseJSON = await startAuthentication({
        optionsJSON: {
          challenge: toBase64URL(generateChallenge()),
          rpId: window.location.hostname,
          allowCredentials: [{ id: credentialId, type: 'public-key' }],
          userVerification: 'preferred',
          timeout: 60000,
        },
      })
      const decoded = decodeAuthentication(result)
      setAuthentication(decoded)
      setActiveView('authentication')
      setActionStatus('authenticate', 'success')
    } catch (err) {
      const name = err instanceof Error ? err.name : 'UnknownError'
      setActionStatus('authenticate', 'error', friendlyError(name))
    }
  }

  async function handleCrossDevice() {
    setActionStatus('crossDevice', 'pending')
    try {
      // Empty allowCredentials → discoverable credential flow.
      // The browser shows its native picker, which includes the
      // "Use a phone or tablet" / QR code option (CTAP2 hybrid transport).
      const result: AuthenticationResponseJSON = await startAuthentication({
        optionsJSON: {
          challenge: toBase64URL(generateChallenge()),
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: 'preferred',
          timeout: 120000,
        },
      })
      const decoded = decodeAuthentication(result)
      setAuthentication(decoded)
      setActiveView('authentication')
      setActionStatus('crossDevice', 'success')
    } catch (err) {
      const name = err instanceof Error ? err.name : 'UnknownError'
      setActionStatus('crossDevice', 'error', friendlyError(name))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-lg font-semibold">WebAuthn Learning App</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Perform passkey ceremonies and inspect every raw byte the browser produces.
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 border-r border-slate-800 overflow-y-auto">
          <ActionPanel
            credentialId={credentialId}
            status={status}
            errorMessage={errorMessage}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
            onCrossDevice={handleCrossDevice}
          />
        </aside>

        <main className="flex-1 overflow-hidden">
          <InspectionPanel
            activeView={activeView}
            registration={registration}
            authentication={authentication}
          />
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Start dev server and verify**

```bash
cd apps/webauthn-demo && npm run dev
```

Open `http://localhost:3000`. Expected:
- Page loads with two-column layout, no errors in browser console.
- Left panel shows three sections: Register, Authenticate, Cross-Device QR.

- [ ] **Step 4: Test Register flow**

1. Click **Register Passkey**
2. Browser shows Touch ID / Windows Hello / biometric prompt — complete it
3. Expected: button status turns green, inspection panel shows:
   - `clientDataJSON.type` = `webauthn.create`
   - `authenticatorData` with `flags.BE = 1` and `flags.BS = 1` (if on a synced passkey device)
   - COSE Public Key with `alg: -7`, and non-empty `x` and `y` hex values

- [ ] **Step 5: Test Authenticate flow**

1. Click **Authenticate**
2. Complete biometric prompt
3. Expected: inspection panel switches to auth view showing:
   - `clientDataJSON.type` = `webauthn.get`
   - `signCount` = 1 (or 0 if device doesn't increment — some platforms don't)
   - Non-empty `signature` hex value

- [ ] **Step 6: Test Cross-Device QR flow**

1. Click **Show Cross-Device Options**
2. Expected: browser shows its native passkey picker dialog
3. On Chrome/Edge: you should see a "Use a phone or tablet" option that generates a QR code
4. Scan with your phone — complete the biometric on your phone
5. Expected: browser returns an authentication response, inspection panel populates

- [ ] **Step 7: Commit**

```bash
cd /Users/rohitaggarwal/Documents/personal/stellar/passkey/stellar-passkey
git add apps/webauthn-demo/app/layout.tsx apps/webauthn-demo/app/page.tsx
git commit -m "feat: wire page.tsx — complete WebAuthn learning app"
```

---

## Self-Review Notes

- **Spec coverage:** All four features covered (register, authenticate, inspect raw objects, cross-device QR). Two-column layout implemented. Error handling for all five common WebAuthn errors included.
- **No placeholders:** All code is complete.
- **Type consistency:** `DecodedRegistration`, `DecodedAuthentication`, `ParsedAuthData`, `CoseKey` used consistently across `types.ts`, `decode.ts`, `InspectionPanel.tsx`, `DecodedAuthData.tsx`, and `page.tsx`. `ActionKey`, `ActionStatus` used consistently in `types.ts`, `ActionPanel.tsx`, and `page.tsx`.
- **One known browser quirk:** Firefox does not support the cross-device QR flow (documented in `docs/compatibility-matrix.md`). The button will show `NotSupportedError` or a cancelled error on Firefox — this is expected and the error message will explain it.
