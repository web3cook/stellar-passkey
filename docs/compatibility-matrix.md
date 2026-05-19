# Passkey Compatibility Matrix

> Legend: ✓ works · ⚠ partial/known quirks · ✗ broken · — untested  
> "Passkey" = discoverable credential synced to a password manager (resident key).  
> "Hardware key" = FIDO2 security key (YubiKey, etc.) — CTAP2 over USB/NFC.

---

## Browser × Feature Matrix

| Browser | Min version | Create passkey | Sign with passkey | Conditional UI | Cross-device QR | Hardware key |
|---|---|---|---|---|---|---|
| Chrome (macOS) | 108 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Chrome (Windows) | 108 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Chrome (Android) | 108 | ✓ | ✓ | ✓ | ✓ | ⚠ USB-C only |
| Safari (macOS 13+) | 16 | ✓ | ✓ | ✓ | ✓ | ⚠ USB only |
| Safari (iOS 16+) | 16 | ✓ | ✓ | ✓ | ✓ | — |
| Firefox (desktop) | 119 | ⚠ | ⚠ | ⚠ 119+ only | ✗ | ✓ |
| Firefox (Android) | 119 | ⚠ | ⚠ | ✗ | ✗ | — |
| Edge (Windows) | 108 | ✓ | ✓ | ✓ | ✓ | ✓ |
| Samsung Internet | 21+ | ⚠ | ⚠ | ✗ | — | — |

### Sync provider per platform

| Platform | Default sync provider |
|---|---|
| macOS + iOS (Safari / Chrome) | iCloud Keychain |
| Windows (Chrome / Edge) | Windows Hello + Google Password Manager (Chrome) |
| Android (Chrome) | Google Password Manager |
| Firefox (any) | No built-in sync — passkeys are device-local |

---

## Platform-Specific Notes

### Chrome / Chromium (all platforms)
- Full passkey support since Chrome 108 (November 2022).
- `authenticatorAttachment: 'platform'` selects the OS-level authenticator (Touch ID, Windows Hello, Android screen lock).
- Conditional UI (autofill passkey prompt) works reliably; requires a `<input autocomplete="username webauthn">` field to anchor the UI.
- Cross-device passkey sign-in via QR code (hybrid transport) works from Chrome 108.
- Security keys work via USB / NFC / BLE.

### Safari (macOS / iOS)
- WebAuthn was available since Safari 13 but passkey *sync* (iCloud Keychain) requires macOS 13 Ventura / iOS 16 (released September 2022).
- On iOS < 16, credentials are device-local (not synced). The WebAuthn ceremony still works; the credential just won't transfer to a new device.
- Conditional UI available since Safari 16 on both macOS and iOS. Requires the `mediation: 'conditional'` option and an appropriately labelled `<input>` field.
- Cross-origin iframe WebAuthn is blocked by default. To allow it, the parent frame must add the Permissions-Policy header: `publickey-credentials-create=*` / `publickey-credentials-get=*`, and the iframe must have `allow="publickey-credentials-create *; publickey-credentials-get *"`.
- WebAuthn is NOT available in WKWebView (Safari's embedded web-view component) prior to iOS 16.4. In-app browsers must use `SFSafariViewController` or `ASWebAuthenticationSession`.

### Firefox (desktop + Android)
- WebAuthn API supported since Firefox 60 (May 2018), but discoverable credentials (resident keys required for passkeys) and platform authenticator integration improved significantly in Firefox 119 (November 2023).
- No built-in passkey sync provider — credentials are stored locally in the Firefox password manager, not synced to iCloud or Google.
- Conditional UI (autofill) available from Firefox 119, but less reliable than Chrome/Safari in practice.
- `authenticatorAttachment: 'platform'` behaves inconsistently across Firefox versions and OS platforms.
- **Recommended approach:** use `browserCapabilities()` before showing the passkey UI and fall back to the Ed25519 backup key flow when `platformAuthenticator` is `false`.
- Cross-device hybrid QR flow not supported.

### Edge (Windows)
- Chromium-based since January 2020. All Chrome WebAuthn notes apply.
- Windows Hello integration is tight — FIDO2 credential is backed by TPM when available.
- Users may see the Windows Hello dialog instead of (or in addition to) a browser-level UI.

### Android (Chrome)
- Platform authenticator uses the device screen lock (PIN, pattern, biometric).
- Passkeys sync to Google Password Manager when the user is signed into Google on the device.
- WebView does NOT support WebAuthn. If your app uses a WebView for an in-app browser, use `Custom Tabs` (which runs the full Chrome engine) instead.
- On Android 9+, `authenticatorAttachment: 'platform'` is reliable.

---

## Known Implementation Quirks

| Quirk | Affected browsers | Workaround |
|---|---|---|
| Conditional UI requires a focused `<input>` | All | Ensure `<input autocomplete="username webauthn">` is in the DOM and visible before calling `startAuthentication({ mediation: 'conditional' })` |
| `authenticatorAttachment: 'platform'` returns ES384 on some Android devices | Samsung / older Android | Accept both -7 (ES256) and -35 (ES384) in `pubKeyCredParams`; `@simplewebauthn/browser` handles this |
| iCloud Keychain passkeys not available when iCloud is signed out | Safari/iOS | Show a message asking the user to sign in to iCloud before creating a passkey |
| WebAuthn blocked in cross-origin iframes without Permissions-Policy | Safari | Set `allow="publickey-credentials-create *; publickey-credentials-get *"` on the iframe element |
| Firefox may show a platform authenticator for CTAP2 USB keys instead of an internal authenticator | Firefox | Detected as `platformAuthenticator: false` via `browserCapabilities()`; show fallback UI |
| WebAuthn times out if the browser tab is hidden | Chrome, Safari | Keep the tab visible during the passkey ceremony; handle `NotAllowedError` to retry |
| `startRegistration` may throw `InvalidStateError` if credential ID already exists | All | Catch `InvalidStateError` and prompt the user to sign in instead of registering |

---

## Fallback Decision Tree

```
const caps = await browserCapabilities();

caps.webauthn === false
  → Passkeys completely unsupported
  → Show ONLY the Ed25519 backup key flow
  → (Firefox < 60, IE, Opera Mini, old Android WebView)

caps.webauthn === true AND caps.platformAuthenticator === false
  → Browser supports WebAuthn but no platform authenticator
  → Show hardware security key option as primary
  → Show Ed25519 backup key as secondary fallback
  → (Firefox on some configurations, Chrome with no biometric hardware)

caps.webauthn === true AND caps.platformAuthenticator === true
  → Full passkey flow available
  → caps.conditionalUI === true
      → Enable autofill passkey discovery on login form
  → caps.conditionalUI === false
      → Use explicit modal-based passkey prompt
```

---

## Security Considerations for this SDK

| Consideration | Status |
|---|---|
| Challenge freshness | Each registration and authentication uses a cryptographically random 32-byte challenge. For auth, the challenge is the `signature_payload` from the Soroban auth entry — it changes with every transaction, preventing replay. |
| Replay protection | The Soroban contract checks that the challenge in `clientDataJSON.challenge` matches the `signature_payload` passed to `__check_auth`. Auth entries also have an expiration ledger. |
| Credential storage | `credentialId` and `contractId` are stored in `localStorage` (POC). Production: use Mercury/Zephyr indexer to look up credentials by passkey assertion, eliminating client-side storage. |
| Contract audit status | The reference contract in this repo is **unaudited** and for demonstration only. Do not use in production. |
| Backup key storage | The Ed25519 backup secret key must be stored by the user (password manager, printed). The SDK never stores it; `localStorage` storage would defeat the purpose. |

---

## Testing Environment (Manual)

| Platform | Device | OS Version | Browser Version | Tested | Notes |
|---|---|---|---|---|---|
| macOS | MacBook Pro (Apple Silicon) | macOS 15 Sequoia | Chrome 131 | — | Target for primary dev testing |
| macOS | MacBook Pro (Apple Silicon) | macOS 15 Sequoia | Safari 18 | — | Target for iCloud Keychain test |
| iOS | iPhone (latest) | iOS 18 | Safari | — | Target for mobile test |
| Android | Pixel | Android 14 | Chrome | — | Target for Google PM test |
| Windows | — | Windows 11 | Edge | — | Target for Windows Hello test |
| Desktop | — | Ubuntu 22 | Firefox 120 | — | Target for Firefox fallback test |
