import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { agingFor } from '../../../data/mockFranchisee'
import { formatCNY } from '../../../lib/format'

const BUCKET_COLORS: Record<string, string> = {
  '0-7d': '#16A34A',   // success — fresh
  '8-14d': '#028090',  // teal — okay
  '15-30d': '#F59E0B', // warn
  '30+d': '#DC2626',   // danger
}

export default function AgingBuckets() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const buckets = agingFor(franchiseePropertyId, mode)
  const total = buckets.reduce((a, b) => a + b.amount, 0)
  const stuck = buckets.find(b => b.range === '30+d')?.amount ?? 0
  const stuckPct = (stuck / total) * 100

  return (
    <Card
      title="Aging — Receivables"
      subtitle={`${formatCNY(total)} across corporate, government, OTA channels`}
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          stuckPct < 5 ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {stuckPct < 5 ? `${stuckPct.toFixed(1)}% over 30 days` : `${stuckPct.toFixed(1)}% stuck >30 days`}
        </div>
      }
    >
      <div className="flex flex-col gap-3 mt-1">
        {/* Combined stacked bar */}
        <div className="h-7 rounded-md overflow-hidden flex bg-slate-100">
          {buckets.map(b => {
            const pct = (b.amount / total) * 100
            return (
              <div
                key={b.range}
                className="h-full transition-all duration-700 ease-out flex items-center justify-center text-[10px] text-white font-mono"
                style={{
                  width: `${pct}%`,
                  background: BUCKET_COLORS[b.range],
                  opacity: platform ? 1 : 0.78,
                }}
                title={`${b.range}: ${formatCNY(b.amount)}`}
              >
                {pct >= 7 ? `${pct.toFixed(0)}%` : ''}
              </div>
            )
          })}
        </div>

        {/* Per-bucket detail */}
        <div className="grid grid-cols-4 gap-3">
          {buckets.map(b => (
            <div key={b.range} className="flex flex-col gap-1 px-3 py-2 rounded-md bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: BUCKET_COLORS[b.range] }} />
                <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate2">{b.range}</span>
              </div>
              <div className="font-serif text-[16px] text-navy-dark tabular-nums">
                {formatCNY(b.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!platform && (
        <div className="mt-4 text-[11.5px] text-warn bg-warn/10 rounded-md px-3 py-2">
          ⚠ Aging report compiled from monthly OTA exports · government TR codes lag 2-3 weeks.
        </div>
      )}
    </Card>
  )
}
