'use client'

import { archiveItems } from '@/data/archive'
import { ArchiveCard } from '@/components/ui/ArchiveCard'

export function ArchiveModule() {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.28em] text-violet-200/70">档案访问</p>
          <h2 className="mt-2 text-3xl font-black tracking-[0.04em] text-white">已回收片段</h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-100/55">
          已索引 {archiveItems.length} 个片段
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {archiveItems.map(item => <ArchiveCard key={item.id} item={item} />)}
      </div>
    </section>
  )
}
