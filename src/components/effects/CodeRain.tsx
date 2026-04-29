'use client'

const glyphs = [
  '0xVOID',
  '101101',
  'TRACE',
  'SCAN',
  'ROOT',
  'NULL',
  'PKT',
  'RED',
  'HASH',
  'SYNC',
  'SIG',
  'CORE',
]

const columns = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 2.43) % 100}%`,
  delay: `${(index % 12) * -0.42}s`,
  duration: `${7.8 + (index % 9) * 0.58}s`,
  opacity: 0.08 + (index % 5) * 0.025,
  tone: index % 11 === 0 ? 'text-red-300' : index % 3 === 0 ? 'text-zinc-200' : 'text-cyan-200',
}))

function columnText(index: number) {
  return Array.from({ length: 18 }, (_, line) => glyphs[(index + line * 3) % glyphs.length]).join('\n')
}

export function CodeRain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-80 mix-blend-screen">
      {columns.map(column => (
        <pre
          key={column.id}
          className={`code-rain-column absolute top-[-38vh] whitespace-pre font-mono text-[10px] font-black leading-5 tracking-[0.18em] ${column.tone}`}
          style={{
            left: column.left,
            animationDelay: column.delay,
            animationDuration: column.duration,
            opacity: column.opacity,
          }}
        >
          {columnText(column.id)}
        </pre>
      ))}
    </div>
  )
}
