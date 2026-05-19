import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import {
  Address,
  Keypair,
  nativeToScVal,
  Operation,
  rpc,
  type Transaction,
} from '@stellar/stellar-sdk';

import { base64urlDecode, base64urlEncode, derToRaw, spkiToRaw } from './crypto.js';
import {
  buildBaseTx,
  computeAuthPayload,
  encodeEd25519Signature,
  encodeSecp256r1Signature,
  findContractAuthEntry,
  server,
  setAuthExpiration,
  simulateSignAndSend,
  WALLET_WASM_HASH,
} from './soroban.js';
import type { WalletCredential } from './types.js';

// ─── createWallet ──────────────────────────────────────────────────────────

/**
 * Register a new passkey and deploy a Soroban smart wallet on Testnet.
 *
 * Flow:
 *  1. WebAuthn registration ceremony → P-256 keypair on device
 *  2. Fund an ephemeral keypair via Friendbot (testnet only, POC)
 *  3. Deploy a new contract instance from WALLET_WASM_HASH
 *  4. Call add_passkey(credentialId, pk) on the new contract (first call, no auth needed)
 *  5. Return { contractId, credentialId }
 *
 * ⚠️  Uses Friendbot — testnet only. Production needs a relayer or user-funded account.
 */
export async function createWallet(name: string): Promise<WalletCredential> {
  // 1. WebAuthn registration
  const challenge = base64urlEncode(crypto.getRandomValues(new Uint8Array(32)));
  const registration = await startRegistration({
    optionsJSON: {
      challenge,
      rp: {
        name: 'Stellar Passkey',
        id: window.location.hostname,
      },
      user: {
        id: base64urlEncode(crypto.getRandomValues(new Uint8Array(16))),
        name,
        displayName: name,
      },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // ES256 = P-256
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        residentKey: 'required',
        userVerification: 'required',
      },
      timeout: 60_000,
      attestation: 'none',
    },
  });

  if (!registration.response.publicKey) {
    throw new Error('Browser did not return publicKey in registration response');
  }

  const credentialId = registration.id; // base64url string
  const credentialIdBytes = base64urlDecode(credentialId);

  // 2. Extract uncompressed P-256 public key (65 bytes: 04 || x || y)
  const publicKeyBytes = await spkiToRaw(registration.response.publicKey);

  // 3. Fund an ephemeral keypair via Friendbot (testnet POC)
  const ephemeral = Keypair.random();
  await server.requestAirdrop(ephemeral.publicKey());

  // 4. Deploy new contract instance from WASM hash
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const deployTxBuilder = await buildBaseTx(ephemeral.publicKey());
  const deployTx = deployTxBuilder
    .addOperation(
      Operation.createCustomContract({
        address: new Address(ephemeral.publicKey()),
        wasmHash: Buffer.from(WALLET_WASM_HASH, 'hex'),
        salt: Buffer.from(salt),
      }),
    )
    .build();

  const deploySim = await server.simulateTransaction(deployTx);
  if (!rpc.Api.isSimulationSuccess(deploySim) || !deploySim.result?.retval) {
    throw new Error('Contract deploy simulation did not return a contract address');
  }
  const contractId = Address.fromScVal(deploySim.result.retval).toString();

  await simulateSignAndSend(deployTx, tx => tx.sign(ephemeral));

  // 5. Call add_passkey (first call — no auth required, Initialized = false)
  const addPasskeyTxBuilder = await buildBaseTx(ephemeral.publicKey());
  const addPasskeyTx = addPasskeyTxBuilder
    .addOperation(
      Operation.invokeContractFunction({
        contract: contractId,
        function: 'add_passkey',
        args: [
          nativeToScVal(Buffer.from(credentialIdBytes)),   // id: Bytes
          nativeToScVal(Buffer.from(publicKeyBytes)),       // pk: BytesN<65>
        ],
      }),
    )
    .build();

  await simulateSignAndSend(addPasskeyTx, tx => tx.sign(ephemeral));

  return { contractId, credentialId };
}

// ─── signTransaction ───────────────────────────────────────────────────────

/**
 * Sign a Stellar transaction using a registered passkey.
 *
 * The transaction must have already been simulated so that its Soroban auth
 * entries are populated. This function finds the auth entry for the smart wallet,
 * uses the signature_payload as the WebAuthn challenge, gets the assertion,
 * attaches the AccountSignature, and returns the assembled + signed transaction.
 *
 * The caller is responsible for submitting the returned transaction.
 */
export async function signTransaction(
  tx: Transaction,
  credentialId: string,
  contractId: string,
): Promise<Transaction> {
  // Find the auth entry that belongs to our smart wallet contract
  const authEntry = findContractAuthEntry(tx, contractId);
  if (!authEntry) {
    throw new Error(`No auth entry found for contract ${contractId}`);
  }

  // Set expiration: current ledger + 100 (≈ 8 minutes on Testnet)
  const { sequence: latestLedger } = await server.getLatestLedger();
  setAuthExpiration(authEntry, latestLedger + 100);

  // Compute the 32-byte payload that __check_auth will receive
  const sigPayload = computeAuthPayload(authEntry);

  // Use the payload as the WebAuthn challenge (the contract verifies this exact match)
  const challenge = base64urlEncode(sigPayload);

  // WebAuthn authentication ceremony
  const assertion = await startAuthentication({
    optionsJSON: {
      challenge,
      rpId: window.location.hostname,
      allowCredentials: [{ id: credentialId, type: 'public-key' }],
      userVerification: 'required',
      timeout: 60_000,
    },
  });

  const authenticatorData = base64urlDecode(assertion.response.authenticatorData);
  const clientDataJSON = base64urlDecode(assertion.response.clientDataJSON);
  const derSig = base64urlDecode(assertion.response.signature);
  const rawSig = derToRaw(derSig);
  const credentialIdBytes = base64urlDecode(credentialId);

  // Build the AccountSignature ScVal and attach to the auth entry
  const accountSig = encodeSecp256r1Signature(
    credentialIdBytes,
    authenticatorData,
    clientDataJSON,
    rawSig,
  );
  authEntry.credentials().address().signature(accountSig);

  return tx;
}

// ─── addBackupSigner ───────────────────────────────────────────────────────

/**
 * Register an Ed25519 keypair as a backup signer on an existing wallet.
 * Requires a valid passkey to authorize the add_backup contract call.
 *
 * Call this immediately after createWallet and store the backup secret key safely.
 */
export async function addBackupSigner(
  contractId: string,
  credentialId: string,
  backupKeypair: Keypair,
): Promise<void> {
  // We need a fee-paying account. Re-use an ephemeral keypair funded by Friendbot.
  // In production this would be a relayer.
  const feePayer = Keypair.random();
  await server.requestAirdrop(feePayer.publicKey());

  const txBuilder = await buildBaseTx(feePayer.publicKey());
  const tx = txBuilder
    .addOperation(
      Operation.invokeContractFunction({
        contract: contractId,
        function: 'add_backup',
        args: [
          nativeToScVal(Buffer.from(backupKeypair.rawPublicKey())), // backup_key: BytesN<32>
        ],
      }),
    )
    .build();

  // Simulate to get auth entries
  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) throw new Error('Simulation failed for add_backup');

  // Rebuild with soroban data (so auth entries appear on the tx)
  const assembled = server.prepareTransaction(tx);
  const assembledTx = (await assembled) as Transaction;

  // Sign the auth entry with the passkey
  const signed = await signTransaction(assembledTx, credentialId, contractId);

  // Sign the transaction envelope with the fee payer
  signed.sign(feePayer);

  // Submit
  const sent = await server.sendTransaction(signed);
  if (sent.status === 'ERROR') throw new Error(`add_backup failed: ${JSON.stringify(sent.errorResult)}`);
  await server.pollTransaction(sent.hash);
}

// ─── signWithBackup ────────────────────────────────────────────────────────

/**
 * Sign a transaction using the backup Ed25519 keypair (recovery path).
 * Use this when the passkey device is lost or unavailable.
 */
export async function signWithBackup(
  tx: Transaction,
  backupKeypair: Keypair,
  contractId: string,
): Promise<Transaction> {
  const authEntry = findContractAuthEntry(tx, contractId);
  if (!authEntry) throw new Error(`No auth entry found for contract ${contractId}`);

  const { sequence: latestLedger } = await server.getLatestLedger();
  setAuthExpiration(authEntry, latestLedger + 100);

  const sigPayload = computeAuthPayload(authEntry);

  // Ed25519 sign with the backup keypair
  const sig = backupKeypair.sign(sigPayload);

  const accountSig = encodeEd25519Signature(
    backupKeypair.rawPublicKey(),
    sig,
  );
  authEntry.credentials().address().signature(accountSig);

  return tx;
}
