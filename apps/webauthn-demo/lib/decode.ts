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
    authDataBuffer = attestation.authData.buffer.slice(
      attestation.authData.byteOffset,
      attestation.authData.byteOffset + attestation.authData.byteLength,
    ) as ArrayBuffer
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
