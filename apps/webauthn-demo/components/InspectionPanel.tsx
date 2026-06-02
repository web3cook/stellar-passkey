import { DecodedAuthData } from './DecodedAuthData'
import type { ActiveView, DecodedAuthentication, DecodedRegistration } from '@/lib/types'

type Props = {
  activeView: ActiveView
  registration: DecodedRegistration | null
  authentication: DecodedAuthentication | null
}

export function InspectionPanel({ activeView, registration, authentication }: Props) {
  if (!activeView) {
    return (
      <div className="flex items-center justify-center py-16 md:h-full text-slate-500 text-sm">
        Perform a ceremony above to inspect the WebAuthn response.
      </div>
    )
  }

  return (
    <div className="overflow-y-auto md:h-full space-y-6 p-6 bg-slate-900 text-sm">
      {activeView === 'registration' && registration && (
        <RegistrationView data={registration} />
      )}
      {activeView === 'authentication' && authentication && (
        <AuthenticationView data={authentication} />
      )}
    </div>
  )
}

function RegistrationView({ data }: { data: DecodedRegistration }) {
  return (
    <>
      <Section title="clientDataJSON" note='type: "webauthn.create"'>
        <KVRow k="type" v={data.clientDataJSON.type} />
        <KVRow k="challenge" v={data.clientDataJSON.challenge} note="random 32 bytes (base64url)" />
        <KVRow k="origin" v={data.clientDataJSON.origin} />
        <KVRow k="crossOrigin" v={String(data.clientDataJSON.crossOrigin)} />
      </Section>

      <Section title="authenticatorData">
        <DecodedAuthData authData={data.authData} />
      </Section>

      <Section
        title="COSE Public Key"
        note={`alg ${data.coseKey.alg} = ${data.coseKey.alg === -7 ? 'ES256 / P-256 (secp256r1)' : data.coseKey.alg === -35 ? 'ES384' : String(data.coseKey.alg)}`}
      >
        <KVRow k="alg" v={String(data.coseKey.alg)} note="stored in the Soroban contract" />
        <KVRow k="x" v={data.coseKey.x} note="public key x coordinate" />
        <KVRow k="y" v={data.coseKey.y} note="public key y coordinate" />
      </Section>

      <Section title="Metadata">
        <KVRow k="credentialId" v={data.credentialId} />
        <KVRow k="publicKeyAlgorithm" v={String(data.publicKeyAlgorithm)} />
        <KVRow k="transports" v={data.transports.join(', ') || '(none reported)'} />
      </Section>
    </>
  )
}

function AuthenticationView({ data }: { data: DecodedAuthentication }) {
  return (
    <>
      <Section title="clientDataJSON" note='type: "webauthn.get"'>
        <KVRow k="type" v={data.clientDataJSON.type} />
        <KVRow
          k="challenge"
          v={data.clientDataJSON.challenge}
          note="in Stellar: this would be the transaction signature_payload"
        />
        <KVRow k="origin" v={data.clientDataJSON.origin} />
      </Section>

      <Section title="authenticatorData" note="signCount increments each authentication">
        <DecodedAuthData authData={data.authData} />
      </Section>

      <Section
        title="signature"
        note="DER-encoded P-256 sig — this is what secp256r1_verify() checks on-chain"
      >
        <p className="font-mono text-xs text-green-400 break-all">{data.signature}</p>
      </Section>

      {data.userHandle && (
        <Section title="userHandle">
          <p className="font-mono text-xs text-green-400">{data.userHandle}</p>
        </Section>
      )}
    </>
  )
}

function Section({
  title,
  note,
  children,
}: {
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-white font-semibold">{title}</h3>
        {note && <span className="text-slate-500 text-xs">{note}</span>}
      </div>
      <div className="pl-3 border-l border-slate-700 space-y-1">{children}</div>
    </div>
  )
}

function KVRow({ k, v, note }: { k: string; v: string; note?: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 items-start font-mono text-xs">
      <span className="text-slate-400 shrink-0">{k}</span>
      <div>
        <span className="text-green-400 break-all">{v}</span>
        {note && <span className="text-slate-500 ml-2 text-[10px]">// {note}</span>}
      </div>
    </div>
  )
}
