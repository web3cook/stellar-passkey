import { createWallet } from '@rohitaggarwal/passkey-sdk';

// <pk-register name="My Wallet"></pk-register>
// Emits: CustomEvent<{ contractId: string, credentialId: string }> named "pk-success"
// Emits: CustomEvent<{ message: string }> named "pk-error"
export class PkRegister extends HTMLElement {
  static observedAttributes = ['name'];

  private button: HTMLButtonElement;
  private status: HTMLSpanElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('button');
    this.button.textContent = 'Create Passkey Wallet';
    this.button.addEventListener('click', () => this.register());

    this.status = document.createElement('span');

    shadow.append(this.button, this.status);
  }

  private async register() {
    const name = this.getAttribute('name') ?? 'Passkey Wallet';
    this.button.disabled = true;
    this.status.textContent = 'Creating…';

    try {
      const credential = await createWallet(name);
      this.status.textContent = 'Wallet created!';
      this.dispatchEvent(new CustomEvent('pk-success', { detail: credential, bubbles: true }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.status.textContent = `Error: ${message}`;
      this.dispatchEvent(new CustomEvent('pk-error', { detail: { message }, bubbles: true }));
    } finally {
      this.button.disabled = false;
    }
  }
}

customElements.define('pk-register', PkRegister);
