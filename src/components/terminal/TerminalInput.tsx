'use client'

import type { FormEvent } from 'react'

type TerminalInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function TerminalInput({ value, onChange, onSubmit }: TerminalInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 p-3 font-mono">
      <span className="text-cyan-200">&gt;</span>
      <input
        aria-label="VOID 终端指令"
        value={value}
        onChange={event => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm uppercase tracking-[0.12em] text-zinc-100 outline-none placeholder:text-zinc-600"
        placeholder="输入 /帮助"
        autoComplete="off"
      />
    </form>
  )
}
