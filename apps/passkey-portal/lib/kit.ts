import { SmartAccountKit } from 'smart-account-kit'
import { IndexedDBStorage } from 'smart-account-kit/storage'
import { Keypair } from '@stellar/stellar-sdk'

let _kit: SmartAccountKit | null = null

export function getKit(): SmartAccountKit {
  if (_kit) return _kit
  _kit = new SmartAccountKit({
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
    networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
    accountWasmHash: process.env.NEXT_PUBLIC_ACCOUNT_WASM_HASH!,
    webauthnVerifierAddress: process.env.NEXT_PUBLIC_WEBAUTHN_VERIFIER_ADDRESS!,
    storage: new IndexedDBStorage(),
  })
  const secret = process.env.NEXT_PUBLIC_FEE_PAYER_SECRET
  if (secret) {
    // Override the fee-payer keypair. The published package has no config option for
    // this, so we patch the private field directly (safe: TS private is compile-time only).
    ;((_kit as unknown) as { deployerKeypair: Keypair }).deployerKeypair = Keypair.fromSecret(secret)
  }
  return _kit
}
