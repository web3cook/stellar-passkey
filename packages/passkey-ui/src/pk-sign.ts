import { signTransaction } from '@rohitaggarwal/passkey-sdk';
import type { Transaction } from '@stellar/stellar-sdk';

// <pk-sign credential-id="abc123"></pk-sign>
// The host passes the Transaction via the `transaction` property (not attribute).
// Emits: CustomEvent<{ xdr: string }> named "pk-signed"
// Emits: CustomEvent<{ message: string }> named "pk-error"
export class PkSign extends HTMLElement {
  transaction: Transaction | null = null;

  private button: HTMLButtonElement;
  private status: HTMLSpanElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('button');
    this.button.textContent = 'Sign with Passkey';
    this.button.addEventListener('click', () => this.sign());

    this.status = document.createElement('span');

    shadow.append(this.button, this.status);
  }

  private async sign() {
    const credentialId = this.getAttribute('credential-id');
    const contractId = this.getAttribute('contract-id');
    if (!credentialId || !contractId || !this.transaction) {
      this.status.textContent = 'Missing transaction, credential-id, or contract-id';
      return;
    }

    this.button.disabled = true;
    this.status.textContent = 'Waiting for passkey…';

    try {
      const signed = await signTransaction(this.transaction, credentialId, contractId);
      this.status.textContent = 'Signed!';
      this.dispatchEvent(new CustomEvent('pk-signed', { detail: { xdr: signed.toXDR() }, bubbles: true }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.status.textContent = `Error: ${message}`;
      this.dispatchEvent(new CustomEvent('pk-error', { detail: { message }, bubbles: true }));
    } finally {
      this.button.disabled = false;
    }
  }
}

customElements.define('pk-sign', PkSign);
