'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TerminalInput } from '@/components/terminal/TerminalInput'
import { signalMessages, terminalHelp } from '@/data/signals'
import { useVoidStore } from '@/store/useVoidStore'
import type { TerminalCommandResult } from '@/components/terminal/terminalCommands'

function evaluateCommand(command: string): TerminalCommandResult {
  const normalized = command.trim().toLowerCase()

  if (!normalized)
    return { output: [] }

  if (normalized === '/help')
    return { output: terminalHelp }
  if (normalized === '/about')
    return { output: ['VOID is a private anomaly interface built for exploration, distortion, and play.'] }
  if (normalized === '/archive')
    return { output: ['ARCHIVE MODULE LINKED.'], module: 'archive' }
  if (normalized === '/signal')
    return { output: ['SIGNAL MODULE LINKED.'], module: 'signal' }
  if (normalized === '/lab')
    return { output: ['LAB MODULE LINKED.'], module: 'lab' }
  if (normalized === '/gate')
    return { output: ['GATE MODULE LINKED. KEEP DISTANCE.'], module: 'gate' }
  if (normalized === '/void')
    return { output: ['ANOMALY PULSE DISPATCHED.'], glitch: true }
  if (normalized === '/echo')
    return { output: [signalMessages[Math.floor(Math.random() * signalMessages.length)]] }
  if (normalized === '/clear')
    return { output: [], clear: true }

  return { output: [`UNKNOWN COMMAND: ${command}`, 'TYPE /help TO REVEAL KNOWN COMMANDS.'] }
}

export function Terminal() {
  const terminalOpen = useVoidStore(state => state.terminalOpen)
  const setActiveModule = useVoidStore(state => state.setActiveModule)
  const triggerGlitch = useVoidStore(state => state.triggerGlitch)
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<string[]>(['VOID TERMINAL SLEEPING. PRESS ~ TO TOGGLE.', 'TYPE /help.'])

  function submit() {
    const command = input.trim()
    const result = evaluateCommand(command)
    setInput('')

    if (result.clear) {
      setLines([])
      return
    }

    if (result.module)
      setActiveModule(result.module)
    if (result.glitch)
      triggerGlitch()

    setLines(current => [...current, `> ${command}`, ...result.output].slice(-18))
  }

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          exit={{ opacity: 0, y: 80, filter: 'blur(12px)' }}
          className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl overflow-hidden border border-cyan-300/30 bg-black/80 shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-2xl hud-corners md:bottom-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em]">
            <span className="text-cyan-100">VOID / terminal</span>
            <span className="text-zinc-500">press ~ to close</span>
          </div>
          <div className="max-h-72 overflow-auto p-4 font-mono text-xs uppercase leading-6 tracking-[0.12em] text-zinc-300">
            {lines.length ? lines.map((line, index) => (
              <p key={`${line}-${index}`} className={line.startsWith('>') ? 'text-cyan-100' : 'text-zinc-400'}>
                {line}
              </p>
            )) : <p className="text-zinc-600">BUFFER CLEARED.</p>}
          </div>
          <TerminalInput value={input} onChange={setInput} onSubmit={submit} />
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
