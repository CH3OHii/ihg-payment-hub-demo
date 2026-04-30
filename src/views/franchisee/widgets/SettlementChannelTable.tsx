import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { settlementsFor } from '../../../data/mockFranchisee'
import { formatCNY } from '../../../lib/format'
import { CheckCircle2, AlertTriangle, Coins } from 'lucide-react'

export default function SettlementChannelTable() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const rows = settlementsFor(franchiseePropertyId, mode)
  const total = rows.reduce((a, r) => a + r.pendingAmount, 0)

  return (
    <Card
      title="Pending Settlements"
      subtitle={`Total in clearing: ${formatCNY(total)} across ${rows.length} channels`}
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {platform ? 'PBOC 24h cutoff cleared' : 'Avg. clearing time: 4.7 days'}
        </div>
      }
      noPadding
    >
      <div className="overflow-hidden">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-slate2 text-[10.5px] uppercase tracking-[0.12em]">
            <tr>
              <th className="text-left px-5 py-2 font-medium">Channel</th>
              <th className="text-right px-3 py-2 font-medium">Pending</th>
              <th className="text-center px-3 py-2 font-medium">T+N</th>
              <th className="text-left px-3 py-2 font-medium">Settles on</th>
              <th className="text-left px-3 py-2 font-medium">FX</th>
              <th className="text-left px-5 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.channel} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-5 py-2.5 text-navy-dark font-medium flex items-center gap-2">
                  <Coins size={13} className="text-slate2" />
                  {r.channel}
                </td>
                <td className="text-right px-3 py-2.5 tabular-nums font-serif text-[13.5px] text-navy-dark">
                  {formatCNY(r.pendingAmount)}
                </td>
                <td className="text-center px-3 py-2.5 tabular-nums">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono ${
                    r.tplus <= 1 ? 'bg-success/10 text-success'
                    : r.tplus <= 7 ? 'bg-teal/10 text-teal'
                    : 'bg-warn/10 text-warn'
                  }`}>
                    T+{r.tplus}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-navy-dark/80 font-mono text-[11.5px]">
                  {r.settlesOn}
                </td>
                <td className="px-3 py-2.5 text-slate2 text-[11.5px] font-mono tabular-nums">
                  {r.fxRate ? r.fxRate.toFixed(3) : '—'}
                </td>
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    {r.onTime ? (
                      <CheckCircle2 size={13} className="text-success" />
                    ) : (
                      <AlertTriangle size={13} className="text-warn" />
                    )}
                    <span className={r.onTime ? 'text-success' : 'text-warn'}>
                      {r.note ?? (r.onTime ? 'On time' : 'Stuck >24h')}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
