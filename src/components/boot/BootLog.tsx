'use client'

import { motion } from 'motion/react'

type BootLogProps = {
  lines: string[]
}

export function BootLog({ lines }: BootLogProps) {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-2xl gap-2 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100/75">
      {lines.map((line, index) => (
        <motion.div
          key={line}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 + index * 0.28, duration: 0.35 }}
          className="border-l border-cyan-300/35 bg-cyan-300/[0.035] px-3 py-2 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
        >
          {line}
        </motion.div>
      ))}
    </div>
  )
}
