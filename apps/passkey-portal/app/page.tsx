'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SealLogo } from '@/components/SealLogo'
import { getKit } from '@/lib/kit'
import { setSession, markAuthed, clearWallet } from '@/lib/session'

const FRIENDLY_ERRORS: Record<string, string> = {
  NotAllowedError: 'Cancelled - try again',
  InvalidStateError: 'Already registered - use Sign In instead',
  SecurityError: 'Requires HTTPS or localhost',
  NotSupportedError: 'Passkeys not supported in this browser',
  AbortError: 'Request was aborted',
}

function toFriendlyError(err: unknown): string {
  if (err instanceof Error) return FRIENDLY_ERRORS[err.name] ?? err.message
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
      const kit = getKit()
      const { contractId, credentialId } = await kit.createWallet('SealPass', 'user', { autoSubmit: true })
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
      const kit = getKit()
      // fresh: true always shows the browser's native passkey picker so the
      // user can choose which passkey (and therefore which wallet) to use.
      const result = await kit.connectWallet({ fresh: true })
      if (!result) {
        setSignInError('Sign-in cancelled')
        setSignInStatus('error')
        return
      }
      setSession({ contractId: result.contractId, credentialId: result.credentialId })
      markAuthed()
      router.push('/app')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('not found on-chain') || msg.includes('not been deployed')) {
        clearWallet()
        setSignInError('Wallet not found on network - testnet may have reset. Please create a new wallet.')
      } else {
        setSignInError(toFriendlyError(err))
      }
      setSignInStatus('error')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1e3a8a 0%, #0a1628 45%, #060d1f 100%)' }}
    >
      {/* Subtle glow behind logo */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 480,
          height: 480,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-lg">
        {/* Logo */}
        <SealLogo size={240} bgColor="#060d1f" ringColor="rgba(59,130,246,0.7)" textColor="rgba(255,255,255,0.9)" />

        {/* Tagline */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Your Stellar wallet,<br />secured by passkey
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            No seed phrases. No complexity.
          </p>
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-center w-full px-3 py-2 rounded-lg border" style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
          Create a wallet or sign in to read the RFP proposal.
        </p>

        {/* CTA cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div
            className="rounded-2xl p-6 flex flex-col gap-4 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(59,130,246,0.25)' }}
          >
            <div>
              <h2 className="font-bold text-white mb-1">Create Wallet</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Register a new Stellar smart account secured by your passkey.
              </p>
            </div>
            {createError && (
              <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}>
                {createError}
              </p>
            )}
            <button
              onClick={handleCreateWallet}
              disabled={createStatus === 'pending'}
              className="w-full py-2.5 rounded-xl font-bold text-white disabled:opacity-50 transition-all"
              style={{ background: '#3b82f6' }}
            >
              {createStatus === 'pending' ? 'Creating…' : 'Create Wallet'}
            </button>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col gap-4 border"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(59,130,246,0.25)' }}
          >
            <div>
              <h2 className="font-bold text-white mb-1">Sign In</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Authenticate with your existing passkey to access your wallet.
              </p>
            </div>
            {signInError && (
              <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}>
                {signInError}
              </p>
            )}
            <button
              onClick={handleSignIn}
              disabled={signInStatus === 'pending'}
              className="w-full py-2.5 rounded-xl font-bold border-2 disabled:opacity-50 transition-all"
              style={{ color: '#3b82f6', borderColor: '#3b82f6', background: 'transparent' }}
            >
              {signInStatus === 'pending' ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            ['🛡️', 'Phishing-resistant'],
            ['🔄', 'Synced across devices'],
            ['✨', 'No seed phrases'],
            ['⚡', 'Instant sign-in'],
          ].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Built on the Stellar Network · Testnet
        </p>
      </div>
    </div>
  )
}
