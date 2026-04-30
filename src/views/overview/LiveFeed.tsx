import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Card from '../../components/Card'
import {
  generateTxn,
  generateTxnFor,
  seedTxnFeed,
  seedTxnFeedFor,
  type Txn,
} from '../../data/mock'
import { useMode } from '../../state/ModeContext'
import { formatCNYExact } from '../../lib/format'
import { CheckCircle2 } from 'lucide-react'

const MAX_ROWS = 14

interface LiveFeedProps {
  propertyId?: string  // when set, stream only that property's txns
  title?: string
  subtitle?: string
}

export default function LiveFeed({ propertyId, title, subtitle }: LiveFeedProps = {}) {
  const { mode } = useMode()
  const platform = mode === 'platform'
  const [feed, setFeed] = useState<Txn[]>(() =>
    propertyId ? seedTxnFeedFor(propertyId, 10) : seedTxnFeed(10)
  )

  // When the propertyId changes (franchisee switches property), reseed the feed.
  useEffect(() => {
    setFeed(propertyId ? seedTxnFeedFor(propertyId, 10) : seedTxnFeed(10))
  }, [propertyId])

  // Stream new txns only in Platform mode. Interval 1000-1800ms for a lively-but-readable cadence.
  useEffect(() => {
    if (!platform) return
    let timeout: number

    const tick = () => {
      setFeed(prev => {
        const next = [
          propertyId
            ? generateTxnFor(propertyId, new Date())
            : generateTxn(new Date()),
          ...prev,
        ]
        if (next.length > MAX_ROWS) next.length = MAX_ROWS
        return next
      })
      timeout = window.setTimeout(tick, 1000 + Math.random() * 800)
    }
    timeout = window.setTimeout(tick, 1200)
    return () => window.clearTimeout(timeout)
  }, [platform, propertyId])

  if (!platform) {
    // Current State: show a stale batch — yesterday's end-of-day export, frozen.
    // Conveys "we have data, but it's 12+ hours old and partial" without leaving a dead space.
    const stale = feed.slice(0, 10)
    return (
      <Card
        title={title ?? 'Transaction Log'}
        subtitle={subtitle ?? 'End-of-day batch · 3 properties missing'}
        right={
          <div className="flex items-center gap-1.5 text-[11px] text-warn">
            <span className="w-1.5 h-1.5 rounded-full bg-warn" />
            Batched 23:47
          </div>
        }
        noPadding
      >
        <div className="h-[380px] overflow-hidden feed-scroll px-4 pt-2 pb-3 relative">
          {stale.map(txn => (
            <div
              key={txn.id}
              className="py-2 border-b border-slate-100 last:border-0 flex flex-col gap-0.5 opacity-70"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate2">yest · {txn.ts}</span>
                <span className="font-serif text-[13.5px] text-navy-dark tabular-nums">
                  {formatCNYExact(txn.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] text-navy-dark/80 truncate">{txn.property.name}</span>
                <span className="text-[10.5px] text-slate2 shrink-0">{txn.channel}</span>
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent h-16 pointer-events-none" />
        </div>
        <div className="px-4 py-2 text-[11px] text-warn bg-warn/5 border-t border-warn/20">
          ⚠ No real-time stream. Contact property for current-day detail.
        </div>
      </Card>
    )
  }

  return (
    <Card
      title={title ?? 'Live Transaction Feed'}
      subtitle={subtitle ?? 'All 612 properties · streaming'}
      right={
        <div className="flex items-center gap-1.5 text-[11px] text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulseDot" />
          Live
        </div>
      }
      noPadding
    >
      <div className="h-[380px] overflow-hidden feed-scroll relative px-4 pt-2 pb-3">
        <AnimatePresence initial={false}>
          {feed.map(txn => (
            <motion.div
              key={txn.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="py-2 border-b border-slate-100 last:border-0 flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate2">{txn.ts}</span>
                <span className="font-serif text-[13.5px] text-navy-dark tabular-nums">
                  {formatCNYExact(txn.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11.5px] text-navy-dark/80 truncate">{txn.property.name}</span>
                <span className="flex items-center gap-1 text-[10.5px] text-slate2 shrink-0">
                  {txn.channel}
                  <CheckCircle2 size={12} className="text-success" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}
