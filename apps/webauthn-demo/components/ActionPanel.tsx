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
