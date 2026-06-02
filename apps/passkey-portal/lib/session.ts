const WALLET_KEY = 'passkey-portal:wallet'
const AUTH_KEY = 'passkey-portal:authed'

export interface WalletSession {
  contractId: string
  credentialId: string
}

// Wallet credentials — persist across disconnect, only removed if user explicitly clears storage
export function getSession(): WalletSession | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(WALLET_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as WalletSession
  } catch {
    return null
  }
}

export function setSession(session: WalletSession): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(session))
  localStorage.setItem(AUTH_KEY, '1')
}

// Auth state — cleared on disconnect, checked by the protected layout
export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function markAuthed(): void {
  localStorage.setItem(AUTH_KEY, '1')
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function clearWallet(): void {
  localStorage.removeItem(WALLET_KEY)
  localStorage.removeItem(AUTH_KEY)
}
