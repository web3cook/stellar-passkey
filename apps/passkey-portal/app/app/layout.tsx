'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthed } from '@/lib/session'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isAuthed()) {
      router.replace('/')
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060d1f' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'rgba(59,130,246,0.2)', borderTopColor: '#3b82f6' }} />
      </div>
    )
  }

  return <>{children}</>
}
