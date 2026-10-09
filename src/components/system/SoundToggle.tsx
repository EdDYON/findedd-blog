'use client'

import { Volume2, VolumeX } from 'lucide-react'
import { playVoidSound } from '@/lib/sound'
import { useVoidStore } from '@/store/useVoidStore'

export function SoundToggle() {
  const soundEnabled = useVoidStore(state => state.soundEnabled)
  const toggleSound = useVoidStore(state => state.toggleSound)

  function handleToggle() {
    const next = !soundEnabled
    toggleSound()
    playVoidSound('click', next)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center justify-center gap-2 border border-violet-300/25 bg-violet-300/[0.06] px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-violet-100 transition hover:border-violet-200/60 hover:bg-violet-300/15 hud-corners"
      aria-pressed={soundEnabled}
    >
      {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      SOUND: {soundEnabled ? 'ON' : 'OFF'}
    </button>
  )
}
