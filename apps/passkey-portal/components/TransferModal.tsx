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
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(6,13,31,0.85)' }}
        onClick={onClose}
      />
      <div
        className="relative z-10 rounded-2xl p-6 w-full max-w-md shadow-2xl border"
        style={{ background: '#0a1628', borderColor: 'rgba(59,130,246,0.25)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Send XLM</h2>
          <button onClick={onClose} className="text-xl leading-none" style={{ color: 'rgba(255,255,255,0.3)' }}>×</button>
        </div>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold text-lg mb-1 text-white">Transfer submitted</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Transaction signed and sent to the network</p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 rounded-xl font-bold text-white transition-all"
              style={{ background: '#3b82f6' }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="G… or C…"
                required
                className="w-full rounded-xl px-3 py-2.5 font-mono text-sm text-white outline-none border"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>
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
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white outline-none border"
                style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'pending'}
              className="w-full py-2.5 rounded-xl font-bold text-white mt-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: '#3b82f6' }}
            >
              {status === 'pending' ? 'Signing with passkey…' : '🔑 Sign with Passkey'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
