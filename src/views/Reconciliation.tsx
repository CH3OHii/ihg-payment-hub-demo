import Card from '../components/Card'
import { properties, vccQueue } from '../data/mock'
import { useMode } from '../state/ModeContext'
import { formatCNYExact } from '../lib/format'
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

const propertyById = new Map(properties.map(p => [p.id, p]))

export default function Reconciliation() {
  const { mode } = useMode()
  const platform = mode === 'platform'

  const rows = vccQueue.map(v => ({
    ...v,
    status: platform ? v.status_platform : v.status_current,
  }))

  const totalPending = rows
    .filter(r => r.status !== 'auto')
    .reduce((s, r) => s + r.amount, 0)

  const autoCount = rows.filter(r => r.status === 'auto').length
  const autoPct = Math.round((autoCount / rows.length) * 100)

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div>
        <h1 className="font-serif text-[26px] text-navy-dark tracking-tight">OTA VCC Reconciliation</h1>
        <p className="text-[12.5px] text-slate2 mt-1">
          Virtual credit cards from Ctrip, Fliggy, Booking, and Agoda against hotel folios
        </p>
      </div>

      {/* Mode-sensitive banner — the punchline of the view */}
      <div
        className={`rounded-card px-5 py-4 flex items-center gap-4 ${
          platform
            ? 'bg-success/10 border border-success/30 text-success'
            : 'bg-danger/10 border border-danger/30 text-danger'
        }`}
      >
        {platform ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
        <div className="flex-1">
          <div className="font-serif text-[20px] text-navy-dark leading-tight">
            {platform
              ? `Auto-matched: ${autoPct}%. Avg clearing time: 18h.`
              : `¥87M pending. 14-day average clearing time.`}
          </div>
          <div className="text-[12.5px] text-slate2 mt-0.5">
            {platform
              ? 'Hub reconciles OTA VCCs against folios automatically. Exceptions surface to finance only.'
              : 'Manual reconciliation across 4 OTA partners. Every row reviewed by hand.'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate2">Open amount</div>
          <div className="font-serif text-[22px] text-navy-dark tabular-nums">
            {formatCNYExact(totalPending)}
          </div>
        </div>
      </div>

      <Card
        title="Queue"
        subtitle={`${rows.length} items · showing last 14 days`}
        noPadding
      >
        <div className="overflow-auto max-h-[520px]">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 bg-white border-b border-slate-200 text-slate2">
              <tr className="text-left">
                <th className="py-2.5 px-5 font-medium">Date</th>
                <th className="py-2.5 px-5 font-medium">OTA Source</th>
                <th className="py-2.5 px-5 font-medium">Property</th>
                <th className="py-2.5 px-5 font-medium text-right">Amount</th>
                <th className="py-2.5 px-5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const prop = propertyById.get(r.property_id)
                return (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="py-2 px-5 font-mono text-[11.5px] text-slate2">{r.date}</td>
                    <td className="py-2 px-5">{r.ota}</td>
                    <td className="py-2 px-5 truncate max-w-[280px]">{prop?.name}</td>
                    <td className="py-2 px-5 text-right tabular-nums">{formatCNYExact(r.amount)}</td>
                    <td className="py-2 px-5">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatusPill({ status }: { status: 'auto' | 'manual' | 'flagged' }) {
  if (status === 'auto') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success">
        <CheckCircle2 size={12} /> Auto-matched
      </span>
    )
  }
  if (status === 'flagged') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-warn/15 text-warn">
        <AlertTriangle size={12} /> Exception
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-warn/15 text-warn">
      <Clock size={12} /> Manual review
    </span>
  )
}
