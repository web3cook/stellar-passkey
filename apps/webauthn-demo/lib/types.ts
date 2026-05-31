export type ParsedAuthData = {
  rpIdHash: string
  flagsByte: number
  flags: {
    UP: boolean   // user present
    UV: boolean   // user verified
    BE: boolean   // backup eligible (passkey can sync)
    BS: boolean   // backup state (passkey is currently synced)
    AT: boolean   // attested credential data present (registration only)
  }
  signCount: number
  // only present when AT flag is set (registration responses)
  aaguid?: string
  credentialId?: string
  coseKeyBytes?: Uint8Array
}

export type CoseKey = {
  alg: number    // -7 = ES256/P-256, the algorithm Soroban uses
  x: string      // hex — the public key x coordinate
  y: string      // hex — the public key y coordinate
}

export type DecodedClientDataJSON = {
  type: string
  challenge: string
  origin: string
  crossOrigin: boolean
}

export type DecodedRegistration = {
  credentialId: string
  clientDataJSON: DecodedClientDataJSON
  authData: ParsedAuthData
  coseKey: CoseKey
  publicKeyAlgorithm: number
  transports: string[]
}

export type DecodedAuthentication = {
  credentialId: string
  clientDataJSON: DecodedClientDataJSON
  authData: ParsedAuthData
  signature: string      // hex — the P-256 signature secp256r1_verify() checks
  userHandle: string | null
}

export type ActiveView = 'registration' | 'authentication' | null
export type ActionStatus = 'idle' | 'pending' | 'success' | 'error'
export type ActionKey = 'register' | 'authenticate' | 'crossDevice'
