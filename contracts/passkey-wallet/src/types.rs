use soroban_sdk::{contracttype, contracterror, Bytes, BytesN};

/// A WebAuthn assertion from the browser.
/// `signature` is raw 64-byte r||s (DER-decoded on the TypeScript side).
#[contracttype]
#[derive(Clone)]
pub struct Secp256r1Signature {
    pub authenticator_data: Bytes,
    pub client_data_json: Bytes,
    pub signature: BytesN<64>,
}

/// Either a passkey (secp256r1) or a backup Ed25519 signature.
#[contracttype]
#[derive(Clone)]
pub enum Signature {
    Secp256r1(Secp256r1Signature),
    Ed25519(BytesN<64>),
}

/// The full auth envelope passed to __check_auth.
/// For Secp256r1: `id` is the WebAuthn credentialId bytes.
/// For Ed25519:   `id` is the 32-byte Ed25519 public key.
#[contracttype]
#[derive(Clone)]
pub struct AccountSignature {
    pub id: Bytes,
    pub signature: Signature,
}

/// Storage keys.
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    /// credentialId bytes → uncompressed P-256 public key (65 bytes: 04 || x || y)
    Passkey(Bytes),
    /// Single Ed25519 backup key (32 bytes)
    Backup,
    /// Set once the first passkey is registered; gates subsequent add_passkey calls
    Initialized,
}

#[contracterror]
#[derive(Copy, Clone, Debug, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    NotFound = 1,
    NoValidSignature = 2,
    ChallengeInvalid = 3,
    JsonParseError = 4,
}
