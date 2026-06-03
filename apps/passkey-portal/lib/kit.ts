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
    deployerSecret: 'SDOXPP7YMGNC54DL4HGR7XR4BLGLGGZ7ACBBT7M4JYVIXWH4OFOEUGO5',
    storage: new IndexedDBStorage(),
  })
  return _kit
}
