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

      <div className="flex flex-col md:flex-row flex-1 md:overflow-hidden">
        <aside className="md:w-80 md:shrink-0 border-b md:border-b-0 md:border-r border-slate-800 md:overflow-y-auto">
          <ActionPanel
            credentialId={credentialId}
            status={status}
            errorMessage={errorMessage}
            onRegister={handleRegister}
            onAuthenticate={handleAuthenticate}
            onCrossDevice={handleCrossDevice}
          />
        </aside>

        <main className="flex-1 md:overflow-hidden">
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
