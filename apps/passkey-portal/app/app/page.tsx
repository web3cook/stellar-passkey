'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Horizon } from '@stellar/stellar-sdk'
import { SealLogo } from '@/components/SealLogo'
import { WalletCard } from '@/components/WalletCard'
import { TransferModal } from '@/components/TransferModal'
import { RFPViewer } from '@/components/RFPViewer'
import { getSession, clearSession } from '@/lib/session'
import { getKit } from '@/lib/kit'

type Tab = 'rfp' | 'wallet'

const HORIZON_URL = 'https://horizon-testnet.stellar.org'
const NATIVE_CONTRACT = process.env.NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT!

export default function AppPage() {
  const router = useRouter()
  const [contractId, setContractId] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('rfp')
  const [showTransfer, setShowTransfer] = useState(false)
  const [funding, setFunding] = useState(false)
  const [fundError, setFundError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setContractId(session.contractId)
  }, [])

  const fetchBalance = useCallback(async (addr: string) => {
    setBalanceLoading(true)
    try {
      const server = new Horizon.Server(HORIZON_URL)
      const account = await server.loadAccount(addr)
      const native = account.balances.find((b) => b.asset_type === 'native')
      setBalance(native ? parseFloat(native.balance).toFixed(2) : '0.00')
    } catch {
      setBalance('—')
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  useEffect(() => {
    if (contractId) fetchBalance(contractId)
  }, [contractId, fetchBalance])

  function handleDisconnect() {
    clearSession()
    router.replace('/')
  }

  async function handleFundWallet() {
    setFunding(true)
    setFundError(null)
    try {
      const kit = getKit()
      await kit.fundWallet(NATIVE_CONTRACT)
      if (contractId) await fetchBalance(contractId)
    } catch (err) {
      setFundError(err instanceof Error ? err.message : 'Funding failed')
    } finally {
      setFunding(false)
    }
  }

  async function handleTransfer(recipient: string, amount: string): Promise<void> {
    const kit = getKit()
    const session = getSession()
    if (!session) throw new Error('Session expired')
    await kit.transfer(NATIVE_CONTRACT, recipient, parseFloat(amount))
    if (contractId) await fetchBalance(contractId)
  }

  if (!contractId) return null

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1e3a8a 0%, #0a1628 45%, #060d1f 100%)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-3 border-b"
        style={{ background: 'rgba(6,13,31,0.8)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <SealLogo size={34} bgColor="#060d1f" ringColor="rgba(59,130,246,0.6)" textColor="rgba(255,255,255,0.8)" />
          <span className="text-sm font-bold tracking-wide text-white hidden md:block">SEALPASS</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-sm px-4 py-1.5 rounded-lg border font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          Disconnect
        </button>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 max-w-4xl mx-auto w-full">
        {/* Tabs */}
        <div
          className="flex gap-1 mb-6 rounded-xl p-1 w-fit border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          {([['rfp', 'RFP Proposal'], ['wallet', 'Wallet']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={
                activeTab === tab
                  ? { background: '#3b82f6', color: '#ffffff' }
                  : { color: 'rgba(255,255,255,0.4)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'rfp' && (
          <div
            className="rounded-2xl p-6 md:p-8 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <RFPViewer />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="flex flex-col gap-6">
            <WalletCard contractId={contractId} balance={balance} loading={balanceLoading} />

            <div
              className="rounded-2xl p-6 border flex flex-col gap-5"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest block mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Balance</span>
                {balanceLoading ? (
                  <div className="h-10 w-40 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {balance ?? '—'} <span className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>XLM</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowTransfer(true)}
                  className="px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all"
                  style={{ background: '#3b82f6' }}
                >
                  Send XLM
                </button>
                <button
                  onClick={handleFundWallet}
                  disabled={funding}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ color: '#3b82f6', borderColor: '#3b82f6', background: 'transparent' }}
                >
                  {funding ? 'Funding…' : 'Fund Wallet'}
                </button>
                <button
                  onClick={() => fetchBalance(contractId)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
                  style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  Refresh
                </button>
                <span
                  className="text-xs px-2.5 py-1 rounded-full border font-medium"
                  style={{ color: '#3b82f6', borderColor: 'rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.1)' }}
                >
                  Testnet
                </span>
              </div>
              {fundError && (
                <p className="text-xs px-3 py-2 rounded-lg border" style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.25)' }}>
                  {fundError}
                </p>
              )}
            </div>
          </div>
        )}
      </main>

      {showTransfer && (
        <TransferModal onClose={() => setShowTransfer(false)} onTransfer={handleTransfer} />
      )}
    </div>
  )
}
