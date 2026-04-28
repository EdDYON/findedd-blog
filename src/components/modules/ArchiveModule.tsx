'use client'

import { archiveItems } from '@/data/archive'
import { ArchiveCard } from '@/components/ui/ArchiveCard'

export function ArchiveModule() {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-violet-200/70">Archive Access</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em] text-white">Recovered Files</h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-100/55">
          {archiveItems.length} fragments indexed
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {archiveItems.map(item => <ArchiveCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}
