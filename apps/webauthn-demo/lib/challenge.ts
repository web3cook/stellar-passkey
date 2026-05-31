export function generateChallenge(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32))
}

export function toBase64URL(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
