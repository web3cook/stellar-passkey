# Passkey Storage, Sync, and Cross-Device Auth

## How Passkeys Are Stored

A passkey is a P-256 (secp256r1) keypair. The **private key** is what needs to be stored and protected. The **public key** is registered with the server (in the Stellar context, the Soroban contract).

### On iPhone (iOS)
- Created via `ASAuthorizationController` (native API, not WebAuthn)
- Private key is generated inside the **Secure Enclave** (hardware chip)
- Stored in **iCloud Keychain**
- Key material is **end-to-end encrypted** and synced to all Apple devices via iCloud's SOS (Secure Object Sync) protocol
- Biometric (Face ID / Touch ID) gates access to the key; it doesn't add another layer of encryption

### On macOS Safari
- Same underlying system — Safari's WebAuthn API (`navigator.credentials.create()`) is backed by `ASAuthorizationController`
- Stored in **iCloud Keychain**
- Syncs automatically with iPhone if both are on the same Apple ID

### On Android / Chrome
- Created via `CredentialManager` API (Android 14+) or the older FIDO2 API
- Stored in **Google Password Manager**
- Synced across Android devices on the same Google account

### On Chrome (desktop, non-macOS)
- Uses the OS authenticator (Windows Hello on Windows, backed by TPM chip)
- Synced via **Google Password Manager** when signed into Chrome

### On Firefox (any platform)
- Stored **locally only** — no sync mechanism
- Each Firefox device has a separate passkey; there is no cross-device access

---

## The Two Types of Passkeys

| Type | Stored where | Synced? | Notes |
|---|---|---|---|
| **Synced passkey** (discoverable / resident key) | iCloud Keychain / Google Password Manager | Yes | What most consumers will have |
| **Device-bound passkey** | Hardware chip (Secure Enclave, TPM) | No | Security keys (YubiKey), some enterprise configs |

Most consumer passkeys today are synced.

---

## How the QR Code Works (Cross-Device Auth)

The QR code does **not** sync the passkey to the new device. This is called **CTAP2 hybrid transport**.

### Flow step by step

1. You open a website on a new laptop that doesn't have your passkey
2. The browser shows a QR code
3. You scan it with your iPhone (which has the passkey in iCloud Keychain)
4. iPhone and laptop establish a **BLE proximity channel** (Bluetooth Low Energy) to verify physical proximity
5. Your iPhone performs the WebAuthn ceremony (signs the challenge) locally
6. The signed response is sent back to the laptop's browser over the encrypted BLE channel
7. **The passkey never moves to the laptop** — the phone acted as the authenticator for that single session

### Key distinction

| Mechanism | What it does | Passkey moves? |
|---|---|---|
| **iCloud / Google sync** | Passkey is available on all your devices permanently | Yes — synced via encrypted cloud |
| **QR code (hybrid transport)** | Phone temporarily authenticates on behalf of another device | No — stays on phone |

---

## What Actually Gets Synced (Apple deep dive)

iCloud Keychain sync uses **SOS (Secure Object Sync)**:
- Each device has a Secure Enclave key used to wrap the passkey material
- The wrapped key is stored in iCloud, encrypted so only your devices can unwrap it
- Apple cannot read the private key — it's end-to-end encrypted
- When you add a new Apple device and sign into your Apple ID, it joins the SOS circle and can unwrap the synced keys

This is why passkeys survive phone upgrades and are available immediately on a new iPhone after iCloud restore.

---

## Web App vs React Native: What You See

| Layer | Web App (WebAuthn) | React Native (`react-native-passkey`) |
|---|---|---|
| API | `navigator.credentials.create()` / `.get()` | `Passkey.create()` / `.authenticate()` |
| Raw objects visible | Yes — `authenticatorData`, `clientDataJSON`, CBOR-encoded public key, signature | No — library parses and returns clean objects |
| Storage | Same underlying system (iCloud Keychain / Google PM) | Same underlying system |
| Learning value | High — you see the actual WebAuthn structures the Soroban contract must verify | Lower — abstracted away |

For learning WebAuthn and understanding what the Soroban contract receives, **start with the web app**.

---

## The Soroban Contract Connection

When a passkey signs a Stellar transaction:

1. The transaction hash (or `signature_payload`) becomes the **WebAuthn challenge**
2. WebAuthn produces:
   - `authenticatorData` — origin, flags, sign counter
   - `clientDataJSON` — contains the challenge (= tx hash)
   - `signature` — P-256 signature over `sha256(authenticatorData || sha256(clientDataJSON))`
3. The Soroban contract's `__check_auth` function reconstructs this same hash and calls `secp256r1_verify()` to check the signature against the registered public key

This is why understanding the raw WebAuthn objects matters before touching the smart contract.
