'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SealLogo } from '@/components/SealLogo'
import { ArchitectureViewer } from '@/components/ArchitectureViewer'
import { isAuthed } from '@/lib/session'

export default function ArchitecturePage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(isAuthed())
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1e3a8a 0%, #0a1628 45%, #060d1f 100%)' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-3 border-b"
        style={{ background: 'rgba(6,13,31,0.8)', borderColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <SealLogo size={34} bgColor="#060d1f" ringColor="rgba(59,130,246,0.6)" textColor="rgba(255,255,255,0.8)" />
          <span className="text-sm font-bold tracking-wide text-white hidden md:block">SEALPASS</span>
        </div>
        <button
          onClick={() => router.push(authed ? '/app' : '/')}
          className="text-sm px-4 py-1.5 rounded-lg border font-medium transition-all"
          style={{ color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
        >
          {authed ? 'Back to App' : 'Home'}
        </button>
      </header>

      <main className="flex-1 px-4 md:px-8 py-6 max-w-4xl mx-auto w-full">
        <div
          className="rounded-2xl p-6 md:p-8 border"
          style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <ArchitectureViewer />
        </div>
      </main>
    </div>
  )
}
