import {
  addBackupSigner,
  browserCapabilities,
  buildBaseTx,
  server,
  signTransaction as sdkSignTransaction,
} from '@rohitaggarwal/passkey-sdk';
import '@rohitaggarwal/passkey-ui';
import { PASSKEY_MODULE_ID, PasskeyModule } from '@rohitaggarwal/wallets-kit-adapter';
import { Networks as KitNetworks, StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import {
  Address,
  Asset,
  Keypair,
  nativeToScVal,
  Networks,
  Operation,
  rpc,
  TransactionBuilder,
  type Transaction,
} from '@stellar/stellar-sdk';

// Native Stellar Asset Contract (XLM) on Testnet — deterministic address.
const NATIVE_SAC_ID = Asset.native().contractId(Networks.TESTNET);
const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';

// ── Kit setup (done once at module load) ──────────────────────────────────────
StellarWalletsKit.init({ modules: [new PasskeyModule()], network: KitNetworks.TESTNET });
StellarWalletsKit.setWallet(PASSKEY_MODULE_ID);

// ── element refs ──────────────────────────────────────────────────────────────
const capsOutput = document.getElementById('caps-output')!;
const registerOutput = document.getElementById('register-output')!;
const backupSetup = document.getElementById('backup-setup')!;
const backupPub = document.getElementById('backup-pub')!;
const backupSec = document.getElementById('backup-sec')!;
const registerBackupBtn = document.getElementById('register-backup-btn') as HTMLButtonElement;
const registerBackupStatus = document.getElementById('register-backup-status')!;
const signSection = document.getElementById('sign-section')!;
const signOutput = document.getElementById('sign-output')!;
const recoverSection = document.getElementById('recover-section')!;
const recoverOutput = document.getElementById('recover-output')!;
const pkSignEl = document.getElementById('pk-sign-el')!;
const pkRecoverEl = document.getElementById('pk-recover-el')!;
const paySection = document.getElementById('pay-section')!;
const fundBtn = document.getElementById('fund-btn') as HTMLButtonElement;
const fundStatus = document.getElementById('fund-status')!;
const balanceOutput = document.getElementById('balance-output')!;
const sendForm = document.getElementById('send-form')!;
const recipientInput = document.getElementById('recipient-input') as HTMLInputElement;
const amountInput = document.getElementById('amount-input') as HTMLInputElement;
const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
const sendStatus = document.getElementById('send-status')!;
const sendOutput = document.getElementById('send-output')!;
const kitSection = document.getElementById('kit-section')!;
const kitConnectBtn = document.getElementById('kit-connect-btn') as HTMLButtonElement;
const kitConnectStatus = document.getElementById('kit-connect-status')!;
const kitSignBtn = document.getElementById('kit-sign-btn') as HTMLButtonElement;
const kitSignStatus = document.getElementById('kit-sign-status')!;
const kitOutput = document.getElementById('kit-output')!;

// ── state ────────────────────────────────────────────────────────────────────
let contractId = '';
let credentialId = '';
let backupKeypair: Keypair | null = null;
let signFeePayer: Keypair | null = null;
let recoverFeePayer: Keypair | null = null;
// Stored so we can sign the outer envelope after auth entries are set by the components.
let signTx: Transaction | null = null;
let recoverTx: Transaction | null = null;

// ── 0. Browser capabilities ───────────────────────────────────────────────────
browserCapabilities().then((caps) => {
  capsOutput.innerHTML = [
    badge(caps.webauthn, 'WebAuthn'),
    badge(caps.platformAuthenticator, 'Platform authenticator'),
    badge(caps.conditionalUI, 'Conditional UI', true),
  ].join('&nbsp;');
});

function badge(value: boolean, label: string, warn = false): string {
  const cls = value ? 'ok' : warn ? 'warn' : 'fail';
  return `<span class="badge ${cls}">${label}: ${value ? 'yes' : 'no'}</span>`;
}

// ── 1. Wallet created ─────────────────────────────────────────────────────────
document.addEventListener('pk-success', (e) => {
  const detail = (e as CustomEvent<{ contractId: string; credentialId: string }>).detail;
  contractId = detail.contractId;
  credentialId = detail.credentialId;

  registerOutput.textContent = JSON.stringify(detail, null, 2);
  registerOutput.style.display = 'block';

  // Generate backup keypair and surface it immediately — user must save before continuing.
  backupKeypair = Keypair.random();
  backupPub.textContent = backupKeypair.publicKey();
  backupSec.textContent = backupKeypair.secret();
  backupSetup.style.display = 'block';
});

// ── 2. Register backup key ─────────────────────────────────────────────────────
registerBackupBtn.addEventListener('click', async () => {
  if (!backupKeypair || !contractId || !credentialId) return;
  registerBackupBtn.disabled = true;
  setStatus(registerBackupStatus, 'Registering backup key — passkey prompt coming…');

  try {
    // This triggers the passkey ceremony + submits add_backup on-chain.
    await addBackupSigner(contractId, credentialId, backupKeypair);
    setStatus(registerBackupStatus, 'Backup key registered on Testnet. Building demo transactions…');

    await buildDemoTransactions();

    setStatus(registerBackupStatus, 'Ready. Use Steps 2–5 to demo signing, recovery, payments, and kit integration.');
    signSection.classList.remove('locked');
    recoverSection.classList.remove('locked');
    paySection.classList.remove('locked');
    kitSection.classList.remove('locked');

    // Pre-fill recipient with a random testnet address for convenience.
    recipientInput.value = Keypair.random().publicKey();
  } catch (err) {
    setStatus(registerBackupStatus, errorMsg(err), true);
    registerBackupBtn.disabled = false;
  }
});

// ── Build separate demo transactions (one per signing path) ───────────────────
async function buildDemoTransactions(): Promise<void> {
  // Two throwaway keys — they become the stored backup key on the contract.
  // We use different keys so sign and recover don't conflict with each other.
  const signDemoKey = Keypair.random();
  const recoverDemoKey = Keypair.random();

  // Fund two fee-payer accounts in parallel.
  signFeePayer = Keypair.random();
  recoverFeePayer = Keypair.random();
  setStatus(registerBackupStatus, 'Funding demo fee accounts via Friendbot…');
  await Promise.all([
    server.requestAirdrop(signFeePayer.publicKey()),
    server.requestAirdrop(recoverFeePayer.publicKey()),
  ]);

  setStatus(registerBackupStatus, 'Simulating demo transactions…');
  const [signAssembled, recoverAssembled] = await Promise.all([
    assembleAddBackupTx(signDemoKey, signFeePayer),
    assembleAddBackupTx(recoverDemoKey, recoverFeePayer),
  ]);

  signTx = signAssembled;
  recoverTx = recoverAssembled;

  // Wire up the Web Components — they read attributes on button click.
  (pkSignEl as unknown as { transaction: Transaction | null }).transaction = signTx;
  pkSignEl.setAttribute('credential-id', credentialId);
  pkSignEl.setAttribute('contract-id', contractId);

  (pkRecoverEl as unknown as { transaction: Transaction | null }).transaction = recoverTx;
  pkRecoverEl.setAttribute('contract-id', contractId);
}

async function assembleAddBackupTx(targetKey: Keypair, feePayer: Keypair): Promise<Transaction> {
  const builder = await buildBaseTx(feePayer.publicKey());
  const raw = builder
    .addOperation(
      Operation.invokeContractFunction({
        contract: contractId,
        function: 'add_backup',
        args: [nativeToScVal(Buffer.from(targetKey.rawPublicKey()))],
      }),
    )
    .build();

  const sim = await server.simulateTransaction(raw);
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error(`Demo tx simulation failed: ${JSON.stringify((sim as rpc.Api.SimulateTransactionErrorResponse).error)}`);
  }
  return rpc.assembleTransaction(raw, sim).build() as Transaction;
}

// ── 3. Passkey signed → sign outer + submit ───────────────────────────────────
document.addEventListener('pk-signed', async () => {
  if (!signTx || !signFeePayer) return;

  signOutput.textContent = 'Submitting to Testnet…';
  signOutput.style.display = 'block';

  try {
    // signTx already has the Soroban auth entry set by <pk-sign>. Sign the outer envelope.
    signTx.sign(signFeePayer);
    const hash = await submitAndPoll(signTx);
    signOutput.textContent = `Confirmed!\nTx: ${hash}\nhttps://stellar.expert/explorer/testnet/tx/${hash}`;
  } catch (err) {
    signOutput.textContent = `Submission error: ${errorMsg(err)}`;
  }
});

// ── 4. Backup key signed → sign outer + submit ────────────────────────────────
document.addEventListener('pk-recovered', async () => {
  if (!recoverTx || !recoverFeePayer) return;

  recoverOutput.textContent = 'Submitting to Testnet…';
  recoverOutput.style.display = 'block';

  try {
    recoverTx.sign(recoverFeePayer);
    const hash = await submitAndPoll(recoverTx);
    recoverOutput.textContent = `Confirmed!\nTx: ${hash}\nhttps://stellar.expert/explorer/testnet/tx/${hash}`;
  } catch (err) {
    recoverOutput.textContent = `Submission error: ${errorMsg(err)}`;
  }
});

// ── 5. Surface errors from components ────────────────────────────────────────
document.addEventListener('pk-error', (e) => {
  console.error('passkey component error', (e as CustomEvent).detail);
});

// ── 6. Fund the contract wallet ───────────────────────────────────────────────
fundBtn.addEventListener('click', async () => {
  if (!contractId) return;
  fundBtn.disabled = true;
  setStatus(fundStatus, 'Requesting Friendbot airdrop to contract address…');

  try {
    await server.requestAirdrop(contractId);
    const balance = await fetchXlmBalance(contractId);
    balanceOutput.textContent = `Balance: ${balance} XLM`;
    balanceOutput.style.display = 'block';
    setStatus(fundStatus, 'Funded!');
    sendForm.style.display = 'block';
  } catch (err) {
    setStatus(fundStatus, errorMsg(err), true);
    fundBtn.disabled = false;
  }
});

// ── 7. Send XLM via native SAC ────────────────────────────────────────────────
sendBtn.addEventListener('click', async () => {
  const recipient = recipientInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (!recipient || !amount || !contractId || !credentialId) return;

  sendBtn.disabled = true;
  setStatus(sendStatus, 'Building transfer transaction…');

  try {
    const feePayer = Keypair.random();
    setStatus(sendStatus, 'Funding fee account via Friendbot…');
    await server.requestAirdrop(feePayer.publicKey());

    const builder = await buildBaseTx(feePayer.publicKey());
    const amountStroops = BigInt(Math.round(amount * 10_000_000));
    const raw = builder
      .addOperation(
        Operation.invokeContractFunction({
          contract: NATIVE_SAC_ID,
          function: 'transfer',
          args: [
            new Address(contractId).toScVal(),    // from: smart wallet
            new Address(recipient).toScVal(),      // to: recipient
            nativeToScVal(amountStroops, { type: 'i128' }),
          ],
        }),
      )
      .build();

    setStatus(sendStatus, 'Simulating transfer…');
    const sim = await server.simulateTransaction(raw);
    if (!rpc.Api.isSimulationSuccess(sim)) {
      throw new Error(`Simulation failed: ${JSON.stringify((sim as rpc.Api.SimulateTransactionErrorResponse).error)}`);
    }
    const assembled = rpc.assembleTransaction(raw, sim).build() as Transaction;

    setStatus(sendStatus, 'Sign with passkey to authorize transfer…');
    const signed = await sdkSignTransaction(assembled, credentialId, contractId);

    setStatus(sendStatus, 'Submitting…');
    signed.sign(feePayer);
    const txHash = await submitAndPoll(signed);

    const newBalance = await fetchXlmBalance(contractId);
    balanceOutput.textContent = `Balance: ${newBalance} XLM`;

    sendOutput.textContent = [
      `Sent ${amount} XLM to ${recipient}`,
      `Tx: ${txHash}`,
      `https://stellar.expert/explorer/testnet/tx/${txHash}`,
    ].join('\n');
    sendOutput.style.display = 'block';
    setStatus(sendStatus, 'Confirmed!');
  } catch (err) {
    setStatus(sendStatus, errorMsg(err), true);
  } finally {
    sendBtn.disabled = false;
  }
});

// ── 8. Kit: get address ───────────────────────────────────────────────────────
kitConnectBtn.addEventListener('click', async () => {
  kitConnectBtn.disabled = true;
  setStatus(kitConnectStatus, 'Fetching address via StellarWalletsKit…');
  try {
    const { address } = await StellarWalletsKit.fetchAddress();
    setStatus(kitConnectStatus, `Address: ${address}`);
    kitSignBtn.disabled = false;
  } catch (err) {
    setStatus(kitConnectStatus, errorMsg(err), true);
    kitConnectBtn.disabled = false;
  }
});

// ── 7. Kit: sign transaction ──────────────────────────────────────────────────
kitSignBtn.addEventListener('click', async () => {
  if (!contractId) return;
  kitSignBtn.disabled = true;
  setStatus(kitSignStatus, 'Building kit demo transaction…');

  try {
    // Build a fresh transaction — we need a separate one since sign/recover txs may already be used.
    const kitFeePayer = Keypair.random();
    setStatus(kitSignStatus, 'Funding fee account via Friendbot…');
    await server.requestAirdrop(kitFeePayer.publicKey());

    setStatus(kitSignStatus, 'Simulating transaction…');
    const kitDemoKey = Keypair.random();
    const kitTx = await assembleAddBackupTx(kitDemoKey, kitFeePayer);

    // Route through the kit — PasskeyModule.signTransaction runs the passkey ceremony.
    setStatus(kitSignStatus, 'Signing via StellarWalletsKit (passkey prompt coming)…');
    const { signedTxXdr, signerAddress } = await StellarWalletsKit.signTransaction(
      kitTx.toXDR(),
      { networkPassphrase: Networks.TESTNET },
    );

    // Sign the outer envelope with the fee-payer (not done by the kit module).
    // The kit module only handles the Soroban auth entry.
    const parsedTx = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET) as Transaction;
    parsedTx.sign(kitFeePayer);

    setStatus(kitSignStatus, 'Submitting…');
    const txHash = await submitAndPoll(parsedTx);

    kitOutput.textContent = [
      `Kit signer address: ${signerAddress}`,
      `Tx hash: ${txHash}`,
      `https://stellar.expert/explorer/testnet/tx/${txHash}`,
      '',
      'signedTxXdr (auth entries set, outer signed):',
      parsedTx.toXDR(),
    ].join('\n');
    kitOutput.style.display = 'block';
    setStatus(kitSignStatus, 'Confirmed!');
  } catch (err) {
    setStatus(kitSignStatus, errorMsg(err), true);
    kitSignBtn.disabled = false;
  }
});

// ── helpers ───────────────────────────────────────────────────────────────────
async function submitAndPoll(tx: Transaction): Promise<string> {
  const sent = await server.sendTransaction(tx);
  if (sent.status === 'ERROR') {
    throw new Error(`sendTransaction failed: ${JSON.stringify(sent.errorResult)}`);
  }
  const result = await server.pollTransaction(sent.hash);
  if (result.status !== rpc.Api.GetTransactionStatus.SUCCESS) {
    throw new Error(`Transaction ended with status: ${result.status}`);
  }
  return sent.hash;
}

async function fetchXlmBalance(address: string): Promise<string> {
  const res = await fetch(`${HORIZON_TESTNET}/accounts/${encodeURIComponent(address)}`);
  if (!res.ok) return 'unavailable';
  const data = await res.json() as { balances?: { asset_type: string; balance: string }[] };
  return data.balances?.find(b => b.asset_type === 'native')?.balance ?? '0';
}

function setStatus(el: Element, msg: string, isError = false): void {
  el.textContent = msg;
  el.classList.toggle('err', isError);
}

function errorMsg(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
