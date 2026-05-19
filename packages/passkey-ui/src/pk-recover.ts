import { signWithBackup } from '@rohitaggarwal/passkey-sdk';
import { Keypair } from '@stellar/stellar-sdk';
import type { Transaction } from '@stellar/stellar-sdk';

// <pk-recover contract-id="C..."></pk-recover>
// The host passes the Transaction via the `transaction` property.
// The user provides their backup secret key via the input field.
// Emits: CustomEvent<{ xdr: string }> named "pk-recovered"
// Emits: CustomEvent<{ message: string }> named "pk-error"
export class PkRecover extends HTMLElement {
  transaction: Transaction | null = null;

  private input: HTMLInputElement;
  private button: HTMLButtonElement;
  private status: HTMLSpanElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.input = document.createElement('input');
    this.input.type = 'password';
    this.input.placeholder = 'Backup secret key (S...)';

    this.button = document.createElement('button');
    this.button.textContent = 'Recover with backup key';
    this.button.addEventListener('click', () => this.recover());

    this.status = document.createElement('span');

    shadow.append(this.input, this.button, this.status);
  }

  private async recover() {
    const contractId = this.getAttribute('contract-id');
    const secretKey = this.input.value.trim();
    if (!contractId || !secretKey || !this.transaction) {
      this.status.textContent = 'Missing contract-id, secret key, or transaction';
      return;
    }

    this.button.disabled = true;
    this.status.textContent = 'Recovering…';

    try {
      const keypair = Keypair.fromSecret(secretKey);
      const signed = await signWithBackup(this.transaction, keypair, contractId);
      this.status.textContent = 'Recovered!';
      this.dispatchEvent(new CustomEvent('pk-recovered', { detail: { xdr: signed.toXDR() }, bubbles: true }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.status.textContent = `Error: ${message}`;
      this.dispatchEvent(new CustomEvent('pk-error', { detail: { message }, bubbles: true }));
    } finally {
      this.button.disabled = false;
    }
  }
}

customElements.define('pk-recover', PkRecover);
