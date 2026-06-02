# WebAuthn Learning App — Design Spec

**Date:** 2026-06-01  
**Status:** Approved  
**Goal:** A minimal Next.js web app that teaches how WebAuthn passkeys work by letting you perform all four ceremonies and inspect every raw object the browser produces.

---

## Context

This is the first step in a multi-phase project to implement passkey authentication on the Stellar blockchain. Before touching smart contracts, the goal is to understand what the browser produces during a WebAuthn ceremony — specifically the `authenticatorData`, `clientDataJSON`, and `signature` fields that the Soroban contract's `__check_auth` function must eventually verify.

Related docs:
- `docs/passkey-storage-and-sync.md` — how passkeys are stored and synced across devices
- `docs/compatibility-matrix.md` — browser/platform support matrix
- `docs/usage-patterns.md` — SDK usage patterns for the Stellar integration

---

## Scope

A single-page Next.js 14 app (App Router, TypeScript) with no backend. All WebAuthn ceremonies run client-side. Challenge is generated in the browser via `crypto.getRandomValues()` — not production-safe, but correct for learning the browser API.

**In scope:**
- Passkey registration (`startRegistration`)
- Passkey authentication (`startAuthentication`)
- Live decoded inspection panel for every WebAuthn response field
- Cross-device QR flow (CTAP2 hybrid transport)

**Out of scope:**
- Server-side challenge generation or verification
- Soroban contract integration (later phase)
- User accounts or persistence beyond localStorage

---

## Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Modern, TypeScript-first, relevant to real Stellar dApps |
| Language | TypeScript | Type-safe WebAuthn response objects |
| WebAuthn library | `@simplewebauthn/browser` | Same library used in passkey-kit; learning transfers directly |
| CBOR decoding | `cbor-x` | Needed to decode the `attestationObject` and extract the COSE public key |
| Styling | Tailwind CSS | Fast, no separate CSS files |

---

## Architecture

Single page at `/`. No API routes. State lives in `app/page.tsx` and flows down as props.

```
app/
  layout.tsx                ← root layout, Tailwind setup
  page.tsx                  ← main page, wires all state
components/
  ActionPanel.tsx           ← left half: four action buttons with status
  InspectionPanel.tsx       ← right half: decoded WebAuthn response
  DecodedAuthData.tsx       ← parses and labels each authData field
lib/
  challenge.ts              ← crypto.getRandomValues → base64url string
  decode.ts                 ← authData byte-parsing, CBOR public key decode
```

---

## Page Layout

Split two-column layout:

```
┌─────────────────────┬────────────────────────────────┐
│   Action Panel      │   Inspection Panel             │
│                     │                                │
│  [Register]         │  clientDataJSON                │
│  status: idle       │    type: "webauthn.create"     │
│                     │    challenge: "abc123..."      │
│  [Authenticate]     │    origin: "http://localhost"  │
│  status: idle       │                                │
│                     │  authenticatorData             │
│  [Cross-Device QR]  │    rpIdHash: "a3f2..."        │
│  status: idle       │    flags: UP=1 UV=1 BE=1 BS=1  │
│                     │    signCount: 0                │
│                     │    AAGUID: "00000000-..."      │
│                     │    credentialId: "xyz..."      │
│                     │    publicKey (COSE):           │
│                     │      alg: -7 (ES256/P-256)     │
│                     │      x: "deadbeef..."          │
│                     │      y: "cafebabe..."          │
│                     │                                │
│                     │  signature (auth only)         │
│                     │    "3045022100..."             │
└─────────────────────┴────────────────────────────────┘
```

---

## State

All state in `page.tsx`:

```typescript
type AppState = {
  credentialId: string | null          // stored in localStorage after registration
  registrationResult: RegistrationResponseJSON | null
  authResult: AuthenticationResponseJSON | null
  activeView: 'registration' | 'authentication' | null
  status: Record<Action, 'idle' | 'pending' | 'success' | 'error'>
  errorMessage: Record<Action, string | null>
}

type Action = 'register' | 'authenticate' | 'crossDevice'
```

`credentialId` is read from `localStorage` on mount and written after a successful registration.

---

## Component Details

### `ActionPanel`

Renders three sections vertically. Each section has:
- A title and one-line description
- A button
- A status row (idle / spinner / green success / red error with message)

Button behaviour:
- **Register**: generates challenge → calls `startRegistration()` → saves `credentialId` to localStorage → updates `registrationResult`
- **Authenticate**: reads `credentialId` from state → generates challenge → calls `startAuthentication({ allowCredentials: [{ id, transports }] })` → updates `authResult`
- **Cross-Device QR**: generates challenge → calls `startAuthentication({ allowCredentials: [] })` — passing an empty array lets the browser show all options including the QR/nearby-device picker

### `InspectionPanel`

Receives `registrationResult | authResult` and `activeView`. Renders decoded sections:

**Registration view:**
1. `clientDataJSON` — base64url decoded → JSON parsed → pretty-printed with field annotations
2. `authenticatorData` — hex decoded → fields parsed by `DecodedAuthData`
3. Public key — COSE decoded via `cbor-x` → x/y coordinates in hex, algorithm label

**Authentication view:**
1. `clientDataJSON` — same as above; note that `challenge` here is the tx hash in Stellar context
2. `authenticatorData` — same parser; note `signCount` increments each sign
3. `signature` — DER-encoded P-256 signature in hex; this is what `secp256r1_verify()` checks on-chain

### `DecodedAuthData`

Parses the 37+ byte `authenticatorData` buffer:

| Bytes | Field | Display |
|---|---|---|
| 0–31 | rpIdHash | hex + note: SHA-256 of the origin hostname |
| 32 | flags | bit-expanded: UP, RFU1, UV, BE, BS, RFU2, RFU3, AT |
| 33–36 | signCount | uint32 big-endian |
| 37+ | AAGUID, credLen, credId, COSE key | only present in registration (AT flag set) |

### `lib/challenge.ts`

```typescript
export function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32))
}
```

`@simplewebauthn/browser` accepts `Uint8Array` directly for challenge.

### `lib/decode.ts`

- `parseAuthData(buffer: ArrayBuffer): ParsedAuthData` — byte-level parser
- `decodeCoseKey(cborBytes: Uint8Array): { alg: number, x: string, y: string }` — uses `cbor-x` to decode the COSE_Key structure

---

## Error Handling

Each button shows errors inline. Common cases:

| Error | Meaning | Display |
|---|---|---|
| `NotAllowedError` | User cancelled or timed out | "Cancelled — try again" |
| `InvalidStateError` | Credential already registered | "Already registered — use Authenticate instead" |
| `SecurityError` | Origin / rpId mismatch | "Security error — check you're on localhost" |
| `NotSupportedError` | Browser/device doesn't support passkeys | "Passkeys not supported in this browser" |

---

## Out-of-Scope Decisions

- No server-side challenge or verification — this is a learning tool
- No multi-credential support — one credential per browser session
- No styling beyond functional clarity — Tailwind utility classes only, no design system
- No tests — this is an exploratory/learning app

---

## Connection to Stellar (next phase)

Once you understand the raw WebAuthn objects from this app, the next step is:

1. Replace the random challenge with a Stellar `signature_payload` (from a simulated Soroban auth entry)
2. Pass the signed `authenticatorData + clientDataJSON + signature` to the Soroban contract
3. The contract's `__check_auth` reconstructs `sha256(authenticatorData || sha256(clientDataJSON))` and calls `secp256r1_verify()`

The public key registered here (the x/y coordinates visible in the inspection panel) is exactly what gets stored in the Soroban contract.
