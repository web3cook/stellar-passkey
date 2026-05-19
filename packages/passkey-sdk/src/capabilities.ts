import {
  browserSupportsWebAuthn,
  browserSupportsWebAuthnAutofill,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import type { CapabilityReport } from './types.js';

export async function browserCapabilities(): Promise<CapabilityReport> {
  const webauthn = browserSupportsWebAuthn();
  const [platformAuthenticator, conditionalUI] = webauthn
    ? await Promise.all([
        platformAuthenticatorIsAvailable(),
        browserSupportsWebAuthnAutofill(),
      ])
    : [false, false];

  return { webauthn, platformAuthenticator, conditionalUI };
}
