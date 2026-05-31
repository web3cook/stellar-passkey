import type { ParsedAuthData } from '@/lib/types'

type Props = {
  authData: ParsedAuthData
}

export function DecodedAuthData({ authData }: Props) {
  const { rpIdHash, flagsByte, flags, signCount, aaguid, credentialId } = authData

  return (
    <div className="space-y-1 font-mono text-xs">
      <Row label="rpIdHash" value={rpIdHash} note="SHA-256 of the origin hostname" />
      <Row
        label="flags"
        value={`0x${flagsByte.toString(16).padStart(2, '0')} (${flagsByte.toString(2).padStart(8, '0')})`}
        note=""
      />
      <div className="pl-4 space-y-0.5 text-slate-500">
        <FlagRow name="UP" value={flags.UP} note="user present" />
        <FlagRow name="UV" value={flags.UV} note="user verified" />
        <FlagRow name="BE" value={flags.BE} note="backup eligible — passkey can sync" />
        <FlagRow name="BS" value={flags.BS} note="backup state — currently synced" />
        <FlagRow name="AT" value={flags.AT} note="attested credential data present" />
      </div>
      <Row label="signCount" value={String(signCount)} note="increments on each authentication" />
      {aaguid && <Row label="AAGUID" value={aaguid} note="authenticator model identifier" />}
      {credentialId && (
        <Row label="credentialId" value={credentialId} note="base64url — stored in localStorage" />
      )}
    </div>
  )
}

function Row({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 items-start">
      <span className="text-slate-400 shrink-0">{label}</span>
      <div>
        <span className="text-green-400 break-all">{value}</span>
        {note && <span className="text-slate-500 ml-2 text-[10px]">// {note}</span>}
      </div>
    </div>
  )
}

function FlagRow({ name, value, note }: { name: string; value: boolean; note: string }) {
  return (
    <div className="grid grid-cols-[40px_16px_1fr] gap-1">
      <span>{name}</span>
      <span className={value ? 'text-green-400' : 'text-slate-600'}>{value ? '1' : '0'}</span>
      <span className="text-slate-600">// {note}</span>
    </div>
  )
}
