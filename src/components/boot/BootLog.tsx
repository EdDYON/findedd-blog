'use client'

import { motion } from 'motion/react'

type BootLogProps = {
  lines: string[]
  active?: boolean
}

function splitBootLine(line: string) {
  const match = line.match(/^(\[[^\]]+])\s?(.*)$/)

  if (!match)
    return { tag: '', rest: line }

  return { tag: match[1], rest: match[2] }
}

export function BootLog({ lines, active = true }: BootLogProps) {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-2xl gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100/75">
      {active && lines.map((line, index) => {
        const { tag, rest } = splitBootLine(line)

        return (
          <motion.div
            key={line}
            initial={{ opacity: 0, x: -16, clipPath: 'inset(0 100% 0 0)' }}
            animate={{ opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)' }}
            transition={{ delay: 0.25 + index * 0.54, duration: 0.42 }}
            className="boot-log-line glitch-hover border-l border-cyan-300/35 bg-cyan-300/[0.035] px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
            data-text={line}
          >
            {tag && <span className="boot-log-tag">{tag}</span>} {rest}
          </motion.div>
        )
      })}
    </div>
  )
}
