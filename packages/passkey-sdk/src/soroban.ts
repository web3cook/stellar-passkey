import {
  Address,
  hash,
  Networks,
  rpc,
  TransactionBuilder,
  xdr,
  type Transaction,
} from '@stellar/stellar-sdk';

export const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
export const NETWORK_PASSPHRASE = Networks.TESTNET;

// Deployed passkey-wallet WASM (Phase 2). Each createWallet call deploys a new instance.
export const WALLET_WASM_HASH = '561755cf54c80213a1fb7e63cd14f5181707656959bb51a54d553473e99709a3';

export const server = new rpc.Server(TESTNET_RPC_URL, { allowHttp: false });

// ─── ScVal encoding ────────────────────────────────────────────────────────

/**
 * Encode the AccountSignature Rust struct as a Soroban ScVal (ScMap).
 * Matches the #[contracttype] layout: fields sorted alphabetically.
 *
 * AccountSignature { id: Bytes, signature: Signature }
 *   id        → scvBytes
 *   signature → Secp256r1(Secp256r1Signature { authenticator_data, client_data_json, signature })
 *                or Ed25519(BytesN<64>)
 */
export function encodeSecp256r1Signature(
  credentialId: Uint8Array,
  authenticatorData: Uint8Array,
  clientDataJSON: Uint8Array,
  rawSig64: Uint8Array,
): xdr.ScVal {
  const inner = xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('authenticator_data'),
      val: xdr.ScVal.scvBytes(Buffer.from(authenticatorData)),
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('client_data_json'),
      val: xdr.ScVal.scvBytes(Buffer.from(clientDataJSON)),
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('signature'),
      val: xdr.ScVal.scvBytes(Buffer.from(rawSig64)),
    }),
  ]);

  const signatureVariant = xdr.ScVal.scvVec([
    xdr.ScVal.scvSymbol('Secp256r1'),
    inner,
  ]);

  return xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('id'),
      val: xdr.ScVal.scvBytes(Buffer.from(credentialId)),
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('signature'),
      val: signatureVariant,
    }),
  ]);
}

export function encodeEd25519Signature(
  ed25519PublicKey: Uint8Array,
  sig64: Uint8Array,
): xdr.ScVal {
  const signatureVariant = xdr.ScVal.scvVec([
    xdr.ScVal.scvSymbol('Ed25519'),
    xdr.ScVal.scvBytes(Buffer.from(sig64)),
  ]);

  return xdr.ScVal.scvMap([
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('id'),
      val: xdr.ScVal.scvBytes(Buffer.from(ed25519PublicKey)),
    }),
    new xdr.ScMapEntry({
      key: xdr.ScVal.scvSymbol('signature'),
      val: signatureVariant,
    }),
  ]);
}

// ─── Auth entry utilities ──────────────────────────────────────────────────

/**
 * Find the auth entry in a transaction that targets our smart wallet contract.
 * After simulation, auth entries appear in the transaction's Soroban data.
 */
export function findContractAuthEntry(
  tx: Transaction,
  contractId: string,
): xdr.SorobanAuthorizationEntry | undefined {
  const contractAddress = new Address(contractId).toScAddress();
  const contractAddressXdr = contractAddress.toXDR('base64');

  for (const op of tx.operations) {
    if (op.type !== 'invokeHostFunction') continue;
    // Auth entries live on the InvokeHostFunction operation; SDK types don't expose
    // them directly so we access via the property bag.
    const auth: xdr.SorobanAuthorizationEntry[] = (op as unknown as { auth?: xdr.SorobanAuthorizationEntry[] }).auth ?? [];
    for (const entry of auth) {
      const creds = entry.credentials();
      if (creds.switch() !== xdr.SorobanCredentialsType.sorobanCredentialsAddress()) continue;
      const entryAddress = creds.address().address().toXDR('base64');
      if (entryAddress === contractAddressXdr) return entry;
    }
  }
  return undefined;
}

/**
 * Compute the 32-byte signature_payload that __check_auth receives.
 * This is what must be base64url-encoded and used as the WebAuthn challenge.
 */
export function computeAuthPayload(
  entry: xdr.SorobanAuthorizationEntry,
): Buffer {
  const creds = entry.credentials().address();
  const preimage = xdr.HashIdPreimage.envelopeTypeSorobanAuthorization(
    new xdr.HashIdPreimageSorobanAuthorization({
      networkId: hash(Buffer.from(NETWORK_PASSPHRASE)),
      nonce: creds.nonce(),
      signatureExpirationLedger: creds.signatureExpirationLedger(),
      invocation: entry.rootInvocation(),
    }),
  );
  return hash(preimage.toXDR());
}

/**
 * Set the expiration ledger on an auth entry (mutates in place).
 * Typically: current ledger + 100 gives ~8 minutes of validity.
 */
export function setAuthExpiration(
  entry: xdr.SorobanAuthorizationEntry,
  expirationLedger: number,
): void {
  entry.credentials().address().signatureExpirationLedger(expirationLedger);
}

// ─── Transaction submit helpers ────────────────────────────────────────────

/**
 * Simulate, assemble (adds resource fees), sign with signer, submit, and poll.
 * Returns the transaction hash on success.
 */
export async function simulateSignAndSend(
  tx: Transaction,
  sign: (tx: Transaction) => void,
): Promise<string> {
  const sim = await server.simulateTransaction(tx);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error(`Simulation failed: ${JSON.stringify((sim as rpc.Api.SimulateTransactionErrorResponse).error)}`);
  }

  const assembled = rpc.assembleTransaction(tx, sim).build() as Transaction;
  sign(assembled);

  const sent = await server.sendTransaction(assembled);
  if (sent.status === 'ERROR') {
    throw new Error(`Send failed: ${JSON.stringify(sent.errorResult)}`);
  }

  const result = await server.pollTransaction(sent.hash);
  if (result.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Transaction failed with status: ${result.status}`);
  }

  return sent.hash;
}

/**
 * Build a base transaction (not yet simulated/assembled).
 * Caller adds operations, then passes to simulateSignAndSend.
 */
export async function buildBaseTx(sourcePublicKey: string): Promise<TransactionBuilder> {
  const account = await server.getAccount(sourcePublicKey);
  return new TransactionBuilder(account, {
    fee: '1000000', // generous fee; real fee comes from simulation
    networkPassphrase: NETWORK_PASSPHRASE,
  }).setTimeout(30);
}
