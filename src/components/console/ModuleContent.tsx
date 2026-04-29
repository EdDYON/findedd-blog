'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArchiveModule } from '@/components/modules/ArchiveModule'
import { GateModule } from '@/components/modules/GateModule'
import { LabModule } from '@/components/modules/LabModule'
import { SignalModule } from '@/components/modules/SignalModule'
import { ModuleScanTransition } from '@/components/effects/ModuleScanTransition'
import { useVoidStore } from '@/store/useVoidStore'

export function ModuleContent() {
  const activeModule = useVoidStore(state => state.activeModule)

  return (
    <div className="relative overflow-hidden">
      <ModuleScanTransition module={activeModule} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
          exit={{ opacity: 0, y: -18, filter: 'blur(10px)' }}
          transition={{ duration: 0.35 }}
        >
          {activeModule === 'archive' && <ArchiveModule />}
          {activeModule === 'signal' && <SignalModule />}
          {activeModule === 'lab' && <LabModule />}
          {activeModule === 'gate' && <GateModule />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
