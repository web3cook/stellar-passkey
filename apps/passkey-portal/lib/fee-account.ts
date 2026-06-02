import { Keypair } from '@stellar/stellar-sdk'

const FEE_SECRET_KEY = 'passkey-portal:fee-secret'
const FRIENDBOT_URL = 'https://friendbot.stellar.org'

export async function getOrCreateFeeKeypair(): Promise<Keypair> {
  const stored = localStorage.getItem(FEE_SECRET_KEY)
  if (stored) {
    return Keypair.fromSecret(stored)
  }

  const keypair = Keypair.random()
  localStorage.setItem(FEE_SECRET_KEY, keypair.secret())

  await fundViaFriendbot(keypair.publicKey())

  return keypair
}

async function fundViaFriendbot(publicKey: string): Promise<void> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`)
  if (!res.ok) {
    throw new Error(`Friendbot funding failed: ${res.status} ${res.statusText}`)
  }
}
