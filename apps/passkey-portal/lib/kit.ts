import { SmartAccountKit } from 'smart-account-kit'
import { IndexedDBStorage } from 'smart-account-kit/storage'

let _kit: SmartAccountKit | null = null

export function getKit(): SmartAccountKit {
  if (_kit) return _kit
  _kit = new SmartAccountKit({
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
    networkPassphrase: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE!,
    accountWasmHash: process.env.NEXT_PUBLIC_ACCOUNT_WASM_HASH!,
    webauthnVerifierAddress: process.env.NEXT_PUBLIC_WEBAUTHN_VERIFIER_ADDRESS!,
    deployerSecret: process.env.NEXT_PUBLIC_FEE_PAYER_SECRET,
    storage: new IndexedDBStorage(),
  })
  return _kit
}
