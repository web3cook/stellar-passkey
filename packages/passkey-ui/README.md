# @rohitaggarwal/passkey-ui

Framework-agnostic Web Components for passkey flows. Works with React, Vue, Svelte, Angular, or vanilla JS — anything that can use the DOM.

## Install

```bash
npm install @rohitaggarwal/passkey-ui @rohitaggarwal/passkey-sdk @stellar/stellar-sdk
```

```typescript
// Import once to register all three custom elements:
import '@rohitaggarwal/passkey-ui';
```

## Components

### `<pk-register>`

Handles the full wallet creation flow. One click triggers WebAuthn registration + Soroban contract deployment.

```html
<pk-register name="My Wallet"></pk-register>
```

```javascript
document.addEventListener('pk-success', (e) => {
  const { contractId, credentialId } = e.detail;
  // store both — needed for every future signing call
});
document.addEventListener('pk-error', (e) => {
  console.error('Registration failed:', e.detail.message);
});
```

**Attributes**

| Attribute | Type | Description |
|---|---|---|
| `name` | `string` | Display name shown in the WebAuthn dialog (e.g. user's email or username) |

**Events (bubble to `document`)**

| Event | Detail | Description |
|---|---|---|
| `pk-success` | `{ contractId: string, credentialId: string }` | Wallet created and passkey registered |
| `pk-error` | `{ message: string }` | Creation failed |

---

### `<pk-sign>`

Signs a pre-simulated transaction using the registered passkey. The host app is responsible for providing the transaction object and attributes, and for submitting the signed result.

```html
<pk-sign id="signer"
         credential-id="base64url_credential_id"
         contract-id="C...contractAddress...">
</pk-sign>
```

```javascript
const el = document.getElementById('signer');

// Set the assembled Transaction object BEFORE the user clicks Sign
el.transaction = assembledTx;  // Transaction from @stellar/stellar-sdk

document.addEventListener('pk-signed', (e) => {
  const { xdr } = e.detail;
  // xdr is the transaction with the Soroban auth entry set.
  // It still needs the fee-payer's outer signature before submission:
  const tx = TransactionBuilder.fromXDR(xdr, Networks.TESTNET);
  tx.sign(feePayer);
  server.sendTransaction(tx);
});
```

**Attributes**

| Attribute | Type | Description |
|---|---|---|
| `credential-id` | `string` | Base64url WebAuthn credential ID (from `createWallet`) |
| `contract-id` | `string` | Smart wallet contract address (C...) |

**Properties**

| Property | Type | Description |
|---|---|---|
| `transaction` | `Transaction \| null` | The assembled transaction to sign. Must be set before the user clicks. |

**Events (bubble to `document`)**

| Event | Detail | Description |
|---|---|---|
| `pk-signed` | `{ xdr: string }` | Auth entry signed — XDR ready for fee-payer outer signature |
| `pk-error` | `{ message: string }` | Signing failed or user cancelled |

---

### `<pk-recover>`

Signs a transaction using the Ed25519 backup key. The user pastes their backup secret key into an inline input field.

```html
<pk-recover id="recover" contract-id="C...contractAddress..."></pk-recover>
```

```javascript
document.getElementById('recover').transaction = assembledTx;

document.addEventListener('pk-recovered', (e) => {
  const { xdr } = e.detail;
  // same as pk-signed — needs fee-payer signature + submit
});
```

**Attributes**

| Attribute | Type | Description |
|---|---|---|
| `contract-id` | `string` | Smart wallet contract address |

**Properties**

| Property | Type | Description |
|---|---|---|
| `transaction` | `Transaction \| null` | The assembled transaction to sign |

**Events (bubble to `document`)**

| Event | Detail | Description |
|---|---|---|
| `pk-recovered` | `{ xdr: string }` | Auth entry signed with backup key |
| `pk-error` | `{ message: string }` | Recovery failed (wrong key, wrong contract, etc.) |

The component renders a `<input type="password">` for the backup secret key (S...) and a "Recover" button. Both live in shadow DOM.

---

## Framework Examples

### React

```tsx
import '@rohitaggarwal/passkey-ui';
import { useEffect, useRef } from 'react';
import type { Transaction } from '@stellar/stellar-sdk';

function SignButton({ tx, credentialId, contractId }: { tx: Transaction; credentialId: string; contractId: string }) {
  const ref = useRef<HTMLElement & { transaction: Transaction | null }>(null);

  useEffect(() => {
    if (ref.current) ref.current.transaction = tx;
  }, [tx]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { xdr } = (e as CustomEvent).detail;
      console.log('Signed XDR:', xdr);
    };
    document.addEventListener('pk-signed', handler);
    return () => document.removeEventListener('pk-signed', handler);
  }, []);

  return (
    <pk-sign
      ref={ref as React.RefObject<HTMLElement>}
      credential-id={credentialId}
      contract-id={contractId}
    />
  );
}

// TypeScript: add JSX types for custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'pk-register': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { name?: string };
      'pk-sign': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'credential-id'?: string; 'contract-id'?: string };
      'pk-recover': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { 'contract-id'?: string };
    }
  }
}
```

### Vue

```vue
<template>
  <pk-register name="My Wallet" @pk-success="onSuccess" @pk-error="onError" />
</template>

<script setup>
import '@rohitaggarwal/passkey-ui';

function onSuccess(e) {
  const { contractId, credentialId } = e.detail;
}
</script>
```

Note: Vue requires `.` prefix for custom event listeners on Web Components: `@pk-success` maps to `pk-success` DOM event.

---

## Styling

All three components use shadow DOM. To style the internal button and status text, use CSS custom properties (if defined in a future version) or target the host element:

```css
pk-register {
  display: block;
  margin: 1rem 0;
}
/* Shadow parts are not yet exposed — open an issue if you need them */
```
