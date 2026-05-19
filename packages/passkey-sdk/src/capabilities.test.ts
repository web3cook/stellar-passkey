import { describe, it, expect, vi } from 'vitest';
import { browserCapabilities } from './capabilities.js';

vi.mock('@simplewebauthn/browser', () => ({
  browserSupportsWebAuthn: vi.fn(() => true),
  platformAuthenticatorIsAvailable: vi.fn(async () => true),
  browserSupportsWebAuthnAutofill: vi.fn(async () => false),
}));

describe('browserCapabilities', () => {
  it('returns a capability report', async () => {
    const report = await browserCapabilities();
    expect(report).toEqual({
      webauthn: true,
      platformAuthenticator: true,
      conditionalUI: false,
    });
  });
});
