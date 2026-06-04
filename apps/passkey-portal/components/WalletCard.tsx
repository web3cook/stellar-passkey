'use client'

import { useState } from 'react'

interface WalletCardProps {
  contractId: string
  balance: string | null
  loading: boolean
}

export function WalletCard({ contractId, balance, loading }: WalletCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(contractId)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, #3b82f6, #1e40af, #060d1f)' }}>
      <div
        className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f45 100%)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>Smart Account</span>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
            style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.1)' }}
          >
            Testnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs flex-1 truncate" style={{ color: 'rgba(255,255,255,0.55)' }}>{contractId}</span>
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 rounded-lg border transition-all shrink-0 font-medium"
            style={{ color: copied ? '#3b82f6' : 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div>
          <span className="text-xs block mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>Balance</span>
          {loading ? (
            <div className="h-8 w-32 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
          ) : (
            <span className="text-3xl font-bold text-white">
              {balance ?? '-'} <span className="text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>XLM</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}