import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { disputesFor } from '../../../data/mockFranchisee'
import { formatCNYExact } from '../../../lib/format'
import { CircleAlert, CheckCircle2 } from 'lucide-react'

export default function DisputeLog() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const disputes = disputesFor(franchiseePropertyId, mode)
  const open = disputes.filter(d => d.status === 'open')

  return (
    <Card
      title="Fee Disputes"
      subtitle={`${open.length} open · ${disputes.length - open.length} resolved`}
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          open.length === 0 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {open.length === 0 ? 'No open disputes' : `${open.length} need review`}
        </div>
      }
      noPadding
    >
      <ul className="flex flex-col">
        {disputes.slice(0, 6).map(d => (
          <li key={d.id} className="flex items-start gap-3 px-5 py-3 border-t border-slate-100 first:border-t-0">
            {d.status === 'open' ? (
              <CircleAlert size={14} className="text-danger mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={14} className="text-success mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12.5px] text-navy-dark truncate">{d.reason}</span>
                <span className="font-mono text-[11px] text-slate2 shrink-0">{d.date}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-[10.5px] text-slate2 font-mono">{d.id}</span>
                <span className="text-[12px] text-navy-dark/80 tabular-nums">
                  {formatCNYExact(d.amount)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {!platform && open.length > 0 && (
        <div className="px-5 py-2 text-[11px] text-warn bg-warn/5 border-t border-warn/20">
          ⚠ Disputes resolved via email · response time avg 11 days
        </div>
      )}
    </Card>
  )
}
