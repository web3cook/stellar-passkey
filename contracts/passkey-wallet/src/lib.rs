#![no_std]

use soroban_sdk::{
    auth::{Context, CustomAccountInterface},
    contract, contractimpl,
    crypto::Hash,
    Bytes, BytesN, Env, Vec,
};

mod types;
mod verify;

use types::{AccountSignature, ContractError, DataKey, Signature};

/// Passkey-based Stellar smart wallet (POC — not audited).
///
/// Supports two signer types:
///   • Secp256r1 — WebAuthn / passkey (P-256)
///   • Ed25519   — backup keypair for recovery
///
/// Storage layout:
///   Persistent  DataKey::Passkey(id)  → BytesN<65>  (P-256 uncompressed public key)
///   Persistent  DataKey::Backup       → BytesN<32>  (Ed25519 public key)
///   Instance    DataKey::Initialized  → bool
#[contract]
pub struct PasskeyWallet;

#[contractimpl]
impl PasskeyWallet {
    /// Register a passkey signer.
    ///
    /// The very first call (wallet not yet initialized) requires no auth — this is
    /// the bootstrap step, called immediately after contract deployment.
    /// Every subsequent call requires auth from the contract itself (i.e., signed
    /// by an already-registered passkey or the backup key).
    pub fn add_passkey(env: Env, id: Bytes, pk: BytesN<65>) {
        if env
            .storage()
            .instance()
            .get::<DataKey, bool>(&DataKey::Initialized)
            .unwrap_or(false)
        {
            env.current_contract_address().require_auth();
        }

        env.storage()
            .persistent()
            .set(&DataKey::Passkey(id.clone()), &pk);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Passkey(id.clone()), 17_000, 17_000);

        env.storage()
            .instance()
            .set(&DataKey::Initialized, &true);
        env.storage().instance().extend_ttl(17_000, 17_000);
    }

    /// Register an Ed25519 backup signer.
    /// Always requires auth from the contract (must be called after add_passkey).
    pub fn add_backup(env: Env, backup_key: BytesN<32>) {
        env.current_contract_address().require_auth();
        env.storage()
            .persistent()
            .set(&DataKey::Backup, &backup_key);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::Backup, 17_000, 17_000);
    }
}

impl CustomAccountInterface for PasskeyWallet {
    type Error = ContractError;
    type Signature = AccountSignature;

    #[allow(non_snake_case)]
    fn __check_auth(
        env: Env,
        signature_payload: Hash<32>,
        signatures: AccountSignature,
        _auth_contexts: Vec<Context>,
    ) -> Result<(), ContractError> {
        match &signatures.signature {
            Signature::Secp256r1(secp_sig) => {
                let pk: BytesN<65> = env
                    .storage()
                    .persistent()
                    .get(&DataKey::Passkey(signatures.id.clone()))
                    .ok_or(ContractError::NotFound)?;
                verify::secp256r1(&env, &signature_payload, &pk, secp_sig)?;
            }
            Signature::Ed25519(ed_sig) => {
                let backup: BytesN<32> = env
                    .storage()
                    .persistent()
                    .get(&DataKey::Backup)
                    .ok_or(ContractError::NotFound)?;
                let payload_bytes: Bytes = signature_payload.into();
                env.crypto().ed25519_verify(&backup, &payload_bytes, ed_sig);
            }
        }
        Ok(())
    }
}
