import type { ModuleInterface } from '@creit.tech/stellar-wallets-kit';
import { ModuleType } from '@creit.tech/stellar-wallets-kit';
import {
  browserCapabilities,
  createWallet,
  signTransaction as sdkSignTransaction,
} from '@rohitaggarwal/passkey-sdk';
import { Networks, TransactionBuilder, type Transaction } from '@stellar/stellar-sdk';

const STORAGE_KEY = 'passkey-wallet-credential';

// SVG key icon — URL-encoded inline so the package has no image asset dependency.
const PASSKEY_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E" +
  "%3Ccircle cx='7.5' cy='7.5' r='4.5' stroke='%23555' fill='none' stroke-width='1.5'/%3E" +
  "%3Cpath d='m11.5 11.5 8 8M15.5 15.5l2-2M17.5 17.5 20 20' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E" +
  "%3C/svg%3E";

interface StoredCredential {
  contractId: string;
  credentialId: string;
}

// Export so callers can reference the ID without a magic string.
export const PASSKEY_MODULE_ID = 'passkey';

/**
 * stellar-wallets-kit connector for passkey-based Soroban smart wallets.
 *
 * Usage:
 *   StellarWalletsKit.init({ modules: [new PasskeyModule()], network: Networks.TESTNET });
 *   StellarWalletsKit.setWallet(PASSKEY_MODULE_ID);
 *   const { address } = await StellarWalletsKit.fetchAddress();
 *   const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, { networkPassphrase: Networks.TESTNET });
 *
 * Important: signTransaction sets the Soroban authorization entry (passkey signature) but
 * does NOT sign the outer transaction envelope. The fee-payer must sign the envelope
 * separately before submitting. This is intentional — fee payment is separate from
 * smart-wallet authorization.
 */
export class PasskeyModule implements ModuleInterface {
  readonly moduleType = ModuleType.HOT_WALLET;
  readonly productId = PASSKEY_MODULE_ID;
  readonly productName = 'Passkey';
  readonly productUrl = 'https://github.com/rohitaggarwal/stellar-passkey';
  readonly productIcon = PASSKEY_ICON;

  async isAvailable(): Promise<boolean> {
    const caps = await browserCapabilities();
    return caps.webauthn && caps.platformAuthenticator;
  }

  async getAddress(_params?: { path?: string; skipRequestAccess?: boolean }): Promise<{ address: string }> {
    const stored = this.loadCredential();
    if (stored) return { address: stored.contractId };

    const credential = await createWallet('Passkey Wallet');
    this.saveCredential(credential);
    return { address: credential.contractId };
  }

  /**
   * Signs the Soroban authorization entry inside the transaction with the registered passkey.
   *
   * The returned XDR has the auth entry signed but the outer envelope is unsigned — the
   * fee-paying account must still sign before submission. See class-level docblock.
   */
  async signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string; address?: string; path?: string },
  ): Promise<{ signedTxXdr: string; signerAddress?: string }> {
    const stored = this.loadCredential();
    if (!stored) throw new Error('PasskeyModule: no credential found — call getAddress() first');

    const networkPassphrase = opts?.networkPassphrase ?? Networks.TESTNET;
    const tx = TransactionBuilder.fromXDR(xdr, networkPassphrase) as Transaction;

    const signed = await sdkSignTransaction(tx, stored.credentialId, stored.contractId);
    return { signedTxXdr: signed.toXDR(), signerAddress: stored.contractId };
  }

  /**
   * Not supported in v0.1 — passkey wallets use signTransaction for the full auth flow.
   * Individual auth-entry signing requires the caller to manage simulation and reassembly.
   */
  async signAuthEntry(
    _authEntry: string,
    _opts?: { networkPassphrase?: string; address?: string; path?: string },
  ): Promise<{ signedAuthEntry: string; signerAddress?: string }> {
    throw new Error(
      'PasskeyModule: signAuthEntry is not supported in v0.1 — use signTransaction instead',
    );
  }

  async signMessage(
    _message: string,
    _opts?: { networkPassphrase?: string; address?: string; path?: string },
  ): Promise<{ signedMessage: string; signerAddress?: string }> {
    throw new Error('PasskeyModule: signMessage is not supported');
  }

  async getNetwork(): Promise<{ network: string; networkPassphrase: string }> {
    return { network: 'TESTNET', networkPassphrase: Networks.TESTNET };
  }

  async disconnect(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  private loadCredential(): StoredCredential | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as StoredCredential) : null;
    } catch {
      return null;
    }
  }

  private saveCredential(credential: StoredCredential): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credential));
  }
}
