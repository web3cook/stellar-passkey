export interface CapabilityReport {
  webauthn: boolean;
  platformAuthenticator: boolean;
  conditionalUI: boolean;
}

export interface WalletCredential {
  contractId: string;
  credentialId: string;
}
