'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Keypair, TransactionBuilder, BASE_FEE, rpc as StellarRpc, xdr, Address, Operation } from '@stellar/stellar-sdk'
import { SealLogo } from '@/components/SealLogo'
import { WalletCard } from '@/components/WalletCard'
import { TransferModal } from '@/components/TransferModal'
import { RFPViewer } from '@/components/RFPViewer'
import { getSession, clearSession } from '@/lib/session'
import { getKit } from '@/lib/kit'

type Tab = 'rfp' | 'wallet'

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!
const NATIVE_CONTRACT = process.env.NEXT_PUBLIC_NATIVE_TOKEN_CONTRACT!
const ACCOUNT_WASM_HASH = process.env.NEXT_PUBLIC_ACCOUNT_WASM_HASH!

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
      const rpcServer = new StellarRpc.Server(RPC_URL)
      const balanceKey = xdr.ScVal.scvVec([
        xdr.ScVal.scvSymbol('Balance'),
        xdr.ScVal.scvAddress(Address.fromString(addr).toScAddress()),
      ])
      const data = await rpcServer.getContractData(NATIVE_CONTRACT, balanceKey)
      const val = data.val.contractData().val()

      // SAC stores balance as a map: { amount: i128, authorized: bool, clawback: bool }
      const toXlm = (v: xdr.ScVal) => {
        const i128 = v.i128()
        const lo = BigInt(i128.lo().toString())
        const hi = BigInt(i128.hi().toString())
        return (Number((hi << BigInt(64)) | lo) / 10_000_000).toFixed(2)
      }

      if (val.switch().name === 'scvMap') {
        const amountEntry = (val.map() ?? []).find(
          e => e.key().switch().name === 'scvSymbol' && e.key().sym().toString() === 'amount'
        )
        setBalance(amountEntry ? toXlm(amountEntry.val()) : '0.00')
      } else if (val.switch().name === 'scvI128') {
        setBalance(toXlm(val))
      } else {
        setBalance('0.00')
      }
    } catch {
      setBalance('0.00')
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
    if (!contractId) return
    setFunding(true)
    setFundError(null)
    try {
      // Create a temporary keypair and fund it via Friendbot
      const tempKeypair = Keypair.random()
      const fbRes = await fetch(`https://friendbot.stellar.org?addr=${tempKeypair.publicKey()}`)
      if (!fbRes.ok) throw new Error(`Friendbot failed: ${await fbRes.text()}`)

      // Retry getting the account until the ledger closes
      const rpcServer = new StellarRpc.Server(RPC_URL)
      let sourceAccount
      for (let i = 0; i < 10; i++) {
        try {
          sourceAccount = await rpcServer.getAccount(tempKeypair.publicKey())
          break
        } catch {
          await new Promise(r => setTimeout(r, 2000))
        }
      }
      if (!sourceAccount) throw new Error('Temp account not available after Friendbot')

      // Build SAC transfer: temp keypair -> smart contract
      const TRANSFER_STROOPS = BigInt(9000 * 10_000_000)
      const transferFunc = xdr.HostFunction.hostFunctionTypeInvokeContract(
        new xdr.InvokeContractArgs({
          contractAddress: Address.fromString(NATIVE_CONTRACT).toScAddress(),
          functionName: 'transfer',
          args: [
            xdr.ScVal.scvAddress(Address.fromString(tempKeypair.publicKey()).toScAddress()),
            xdr.ScVal.scvAddress(Address.fromString(contractId).toScAddress()),
            xdr.ScVal.scvI128(new xdr.Int128Parts({
              lo: xdr.Uint64.fromString((TRANSFER_STROOPS & BigInt('0xFFFFFFFFFFFFFFFF')).toString()),
              hi: xdr.Int64.fromString((TRANSFER_STROOPS >> BigInt(64)).toString()),
            })),
          ],
        })
      )

      const tx = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(Operation.invokeHostFunction({ func: transferFunc, auth: [] }))
        .setTimeout(30)
        .build()

      const simResult = await rpcServer.simulateTransaction(tx)
      if ('error' in simResult) throw new Error(`Simulation failed: ${simResult.error}`)

      const assembled = StellarRpc.assembleTransaction(tx, simResult).build()
      assembled.sign(tempKeypair)

      const submitResult = await rpcServer.sendTransaction(assembled)
      if (submitResult.status === 'ERROR') throw new Error('Transaction submission failed')

      await rpcServer.pollTransaction(submitResult.hash, { attempts: 15 })
      await fetchBalance(contractId)
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
    // Restore kit state silently (passing both ids skips the passkey picker)
    await kit.connectWallet({ contractId: session.contractId, credentialId: session.credentialId })
    const result = await kit.transfer(NATIVE_CONTRACT, recipient, parseFloat(amount))
    if (!result.success) throw new Error(result.error || 'Transfer failed')
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

            {/* Demo info */}
            <div
              className="rounded-2xl p-5 border flex flex-col gap-2"
              style={{ background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(59,130,246,0.7)' }}>Demo Info</span>
              {[
                'This demo uses smart-account-kit by kalepail built on OpenZeppelin Soroban contracts.',
                `WASM hash: ${ACCOUNT_WASM_HASH}`,
                'Currently running on Stellar Testnet.',
              ].map((line, i) => (
                <p key={i} className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{line}</p>
              ))}
            </div>

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
                    {balance ?? '-'} <span className="text-xl" style={{ color: 'rgba(255,255,255,0.4)' }}>XLM</span>
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
                  {funding ? 'Funding...' : 'Fund Wallet'}
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
