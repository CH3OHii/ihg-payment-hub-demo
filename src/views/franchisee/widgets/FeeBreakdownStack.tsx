import { useState } from 'react'
import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { feesThisMonth, feesYTD } from '../../../data/mockFranchisee'
import AnimatedNumber from '../../../components/AnimatedNumber'
import { formatCNY, formatPct } from '../../../lib/format'

interface Slice {
  key: 'base' | 'marketing' | 'techCrs' | 'loyalty'
  label: string
  description: string
  pctOfRev: number
  color: string
}

const SLICES: Slice[] = [
  { key: 'base',      label: 'Base royalty',           description: '5% of room revenue · core franchise fee',         pctOfRev: 5.0, color: '#0E3B43' },
  { key: 'marketing', label: 'System / marketing',     description: '3% of room revenue · marketing fund',             pctOfRev: 3.0, color: '#028090' },
  { key: 'techCrs',   label: 'Technology & CRS',       description: '1.5% · CRS, distribution, tech platform fees',     pctOfRev: 1.5, color: '#00A896' },
  { key: 'loyalty',   label: 'IHG One Rewards loyalty', description: '2% pass-through · loyalty member acquisition',    pctOfRev: 2.0, color: '#C9A961' },
]

export default function FeeBreakdownStack() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const f = feesThisMonth(franchiseePropertyId)
  const ytd = feesYTD(franchiseePropertyId)
  const [hovered, setHovered] = useState<string | null>(null)

  const totalPct = ((f.total / f.roomRevenue) * 100)

  return (
    <Card
      title="This Month's Royalty Breakdown"
      subtitle={`Room revenue ${formatCNY(f.roomRevenue)} · Fee load ${formatPct(totalPct, 2)}`}
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {platform ? 'Itemized · drillable' : 'Single-line debit on bank statement'}
        </div>
      }
    >
      <div className="flex flex-col gap-4 mt-1">
        {/* Stacked bar */}
        <div className="h-9 rounded-md overflow-hidden flex bg-slate-100">
          {SLICES.map(s => {
            const amount = f[s.key]
            const pct = (amount / f.total) * 100
            const isH = hovered === s.key
            return (
              <div
                key={s.key}
                onMouseEnter={() => setHovered(s.key)}
                onMouseLeave={() => setHovered(null)}
                className="h-full flex items-center justify-center text-[11px] text-white font-medium transition-all duration-700 ease-out cursor-pointer"
                style={{
                  width: `${pct}%`,
                  background: s.color,
                  opacity: !platform ? 0.7 : isH ? 1 : 0.95,
                  outline: isH ? '2px solid rgba(255,255,255,0.6)' : 'none',
                  outlineOffset: '-2px',
                }}
                title={`${s.label}: ${formatCNY(amount)}`}
              >
                {pct >= 14 ? `${pct.toFixed(0)}%` : ''}
              </div>
            )
          })}
        </div>

        {/* Slice details */}
        <div className="grid grid-cols-4 gap-3">
          {SLICES.map(s => {
            const amount = f[s.key]
            const ytdSum = ytd.reduce((a, m) => a + m[s.key], 0)
            return (
              <div
                key={s.key}
                onMouseEnter={() => setHovered(s.key)}
                onMouseLeave={() => setHovered(null)}
                className={`flex flex-col gap-1 px-3 py-2 rounded-md border transition-colors ${
                  hovered === s.key ? 'bg-slate-50 border-slate-200' : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[10.5px] uppercase tracking-[0.10em] text-slate2 truncate">
                    {s.label}
                  </span>
                </div>
                <div className="font-serif text-[18px] text-navy-dark tabular-nums">
                  <AnimatedNumber value={amount} duration={800} format={formatCNY} />
                </div>
                <div className="text-[10.5px] text-slate2">
                  {s.pctOfRev}% of room rev · YTD {formatCNY(ytdSum)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[12px] text-slate2">Total fees this month</span>
          <span className="font-serif text-[26px] text-navy-dark tabular-nums">
            <AnimatedNumber value={f.total} duration={900} format={formatCNY} />
            <span className="text-slate2 text-[14px] ml-2">({formatPct(totalPct, 2)})</span>
          </span>
        </div>

        {!platform && (
          <div className="text-[11.5px] text-warn bg-warn/10 rounded-md px-3 py-2">
            ⚠ Per-stay attribution unavailable. Contact regional finance for line-item drill-down.
          </div>
        )}
      </div>
    </Card>
  )
}
