// Pure cryptographic utilities — no Stellar SDK dependency.

const BASE64URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

export function base64urlEncode(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  while (i + 2 < bytes.length) {
    const b0 = bytes[i]; const b1 = bytes[i + 1]; const b2 = bytes[i + 2];
    out += BASE64URL_CHARS[(b0 >> 2) & 0x3f];
    out += BASE64URL_CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
    out += BASE64URL_CHARS[((b1 << 2) | (b2 >> 6)) & 0x3f];
    out += BASE64URL_CHARS[b2 & 0x3f];
    i += 3;
  }
  const rem = bytes.length - i;
  if (rem === 1) {
    const b0 = bytes[i];
    out += BASE64URL_CHARS[(b0 >> 2) & 0x3f];
    out += BASE64URL_CHARS[(b0 << 4) & 0x3f];
  } else if (rem === 2) {
    const b0 = bytes[i]; const b1 = bytes[i + 1];
    out += BASE64URL_CHARS[(b0 >> 2) & 0x3f];
    out += BASE64URL_CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
    out += BASE64URL_CHARS[(b1 << 2) & 0x3f];
  }
  return out;
}

export function base64urlDecode(s: string): Uint8Array {
  // Normalize to standard base64 then decode
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob(padded);
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}

/**
 * Convert a DER-encoded ECDSA signature to raw 64-byte r||s.
 * WebAuthn returns DER; Soroban's secp256r1_verify expects raw r||s.
 *
 * DER format: 30 [len] 02 [rLen] [r...] 02 [sLen] [s...]
 * r and s may have a leading 0x00 byte (sign byte for positive integers).
 */
export function derToRaw(der: Uint8Array): Uint8Array {
  let off = 0;
  if (der[off++] !== 0x30) throw new Error('Invalid DER signature: expected SEQUENCE');

  // Skip length (handle both 1-byte and 2-byte length)
  if (der[off] > 0x80) off += der[off] - 0x80 + 1; else off++;

  const raw = new Uint8Array(64);

  for (const target of [{ dst: 0 }, { dst: 32 }]) {
    if (der[off++] !== 0x02) throw new Error('Invalid DER signature: expected INTEGER');
    const len = der[off++];
    let start = off;
    // Strip leading zero byte (sign byte)
    if (der[start] === 0x00) { start++; }
    const componentLen = len - (start - off);
    const padStart = target.dst + Math.max(0, 32 - componentLen);
    raw.set(der.slice(start, start + Math.min(componentLen, 32)), padStart);
    off += len;
  }

  return raw;
}

/**
 * Extract the 65-byte uncompressed P-256 public key (04 || x || y)
 * from a base64url-encoded SubjectPublicKeyInfo (SPKI) DER structure,
 * using the WebCrypto API to avoid manual DER parsing.
 */
export async function spkiToRaw(publicKeyBase64url: string): Promise<Uint8Array> {
  const spki = base64urlDecode(publicKeyBase64url);
  // WebCrypto requires a plain ArrayBuffer — copy to guarantee no SharedArrayBuffer
  const spkiBuffer = new ArrayBuffer(spki.byteLength);
  new Uint8Array(spkiBuffer).set(spki);
  const cryptoKey = await crypto.subtle.importKey(
    'spki',
    spkiBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['verify'],
  );
  const raw = await crypto.subtle.exportKey('raw', cryptoKey);
  return new Uint8Array(raw); // 04 || x || y, 65 bytes
}
