use serde::Deserialize;
use soroban_sdk::{crypto::Hash, Bytes, BytesN, Env};

use crate::types::{ContractError, Secp256r1Signature};

/// Verify a WebAuthn secp256r1 (P-256) assertion.
///
/// Algorithm (per W3C WebAuthn §7.2):
///   signed_data = authenticatorData || sha256(clientDataJSON)
///   verify secp256r1(pubkey, sha256(signed_data), signature)
///   check challenge in clientDataJSON == base64url(signature_payload)
pub fn secp256r1(
    env: &Env,
    signature_payload: &Hash<32>,
    public_key: &BytesN<65>,
    sig: &Secp256r1Signature,
) -> Result<(), ContractError> {
    // 1. Build signed_data = authenticatorData || sha256(clientDataJSON)
    let client_data_hash = env.crypto().sha256(&sig.client_data_json);
    let mut signed_data = sig.authenticator_data.clone();
    signed_data.extend_from_array(&client_data_hash.to_array());

    // 2. Hash the combined data
    let data_hash = env.crypto().sha256(&signed_data);

    // 3. Verify the P-256 signature (panics on failure — Soroban crypto convention)
    env.crypto()
        .secp256r1_verify(public_key, &data_hash, &sig.signature);

    // 4. Validate the challenge in clientDataJSON equals base64url(signature_payload)
    validate_challenge(signature_payload, &sig.client_data_json)?;

    Ok(())
}

// ─── Challenge validation ──────────────────────────────────────────────────

#[derive(Deserialize)]
struct ClientData<'a> {
    challenge: &'a str,
}

fn validate_challenge(
    signature_payload: &Hash<32>,
    client_data_json: &Bytes,
) -> Result<(), ContractError> {
    // Encode the 32-byte payload as base64url (no padding → 43 ASCII chars)
    let payload_arr = signature_payload.to_array();
    let expected = base64url_encode_32(&payload_arr);

    // Copy clientDataJSON into a fixed stack buffer for serde-json-core
    const MAX_CDJ: usize = 768;
    let len = (client_data_json.len() as usize).min(MAX_CDJ);
    let mut buf = [0u8; MAX_CDJ];
    for i in 0..len as u32 {
        buf[i as usize] = client_data_json.get(i).unwrap_or(0);
    }

    // Parse only the "challenge" field; other fields are ignored
    let (parsed, _): (ClientData, _) =
        serde_json_core::from_slice(&buf[..len]).map_err(|_| ContractError::JsonParseError)?;

    if parsed.challenge.as_bytes() != expected {
        return Err(ContractError::ChallengeInvalid);
    }

    Ok(())
}

/// Base64url-encode exactly 32 bytes → 43 ASCII chars (no `=` padding).
/// 32 bytes = 10 full triplets (30 bytes → 40 chars) + 2 remaining bytes → 3 chars.
fn base64url_encode_32(input: &[u8; 32]) -> [u8; 43] {
    const CHARS: &[u8; 64] =
        b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let mut out = [0u8; 43];
    let mut i = 0usize;
    let mut o = 0usize;

    // Process 10 triplets → 40 output chars
    while i + 2 < 32 {
        let b0 = input[i] as usize;
        let b1 = input[i + 1] as usize;
        let b2 = input[i + 2] as usize;
        out[o]     = CHARS[(b0 >> 2) & 0x3f];
        out[o + 1] = CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
        out[o + 2] = CHARS[((b1 << 2) | (b2 >> 6)) & 0x3f];
        out[o + 3] = CHARS[b2 & 0x3f];
        i += 3;
        o += 4;
    }

    // Remaining 2 bytes (32 % 3 == 2) → 3 output chars
    let b0 = input[30] as usize;
    let b1 = input[31] as usize;
    out[o]     = CHARS[(b0 >> 2) & 0x3f];
    out[o + 1] = CHARS[((b0 << 4) | (b1 >> 4)) & 0x3f];
    out[o + 2] = CHARS[(b1 << 2) & 0x3f];

    out
}
