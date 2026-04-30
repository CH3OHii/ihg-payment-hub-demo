import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { channelMarginsFor } from '../../../data/mockFranchisee'
import { formatCNY, formatPct } from '../../../lib/format'

const TIER_COLOR: Record<'high' | 'mid' | 'low', { bg: string; text: string; bar: string }> = {
  high: { bg: 'bg-success/10', text: 'text-success', bar: '#16A34A' },
  mid:  { bg: 'bg-warn/10',    text: 'text-warn',    bar: '#F59E0B' },
  low:  { bg: 'bg-danger/10',  text: 'text-danger',  bar: '#DC2626' },
}

export default function ChannelMarginTable() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const rows = channelMarginsFor(franchiseePropertyId, mode)
  const totalNet = rows.reduce((a, r) => a + r.net, 0)
  const totalCommission = rows.reduce((a, r) => a + r.commissionAmt, 0)
  const totalRevenue = rows.reduce((a, r) => a + r.revenue, 0)

  return (
    <Card
      title="Channel Margin"
      subtitle={`This month · revenue ${formatCNY(totalRevenue)} · OTA commission ${formatCNY(totalCommission)}`}
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {platform ? 'Live · commission-aware' : 'Weekly OTA exports · no commission column'}
        </div>
      }
      noPadding
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead className="bg-slate-50 text-slate2 text-[10.5px] uppercase tracking-[0.12em]">
            <tr>
              <th className="text-left px-5 py-2 font-medium">Channel</th>
              <th className="text-right px-3 py-2 font-medium">Bookings</th>
              <th className="text-right px-3 py-2 font-medium">Revenue</th>
              <th className="text-right px-3 py-2 font-medium">Comm %</th>
              <th className="text-right px-3 py-2 font-medium">Comm ¥</th>
              <th className="text-right px-3 py-2 font-medium">Net</th>
              <th className="text-left px-5 py-2 font-medium">Margin tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const t = TIER_COLOR[r.marginTier]
              const netShare = (r.net / totalNet) * 100
              return (
                <tr key={r.channel} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-5 py-2.5 text-navy-dark font-medium">{r.channel}</td>
                  <td className="text-right px-3 py-2.5 tabular-nums text-slate2">{r.bookings}</td>
                  <td className="text-right px-3 py-2.5 tabular-nums text-navy-dark">
                    {formatCNY(r.revenue)}
                  </td>
                  <td className="text-right px-3 py-2.5 tabular-nums">
                    {platform || r.commissionPct === 0 ? (
                      <span className={r.commissionPct === 0 ? 'text-success' : 'text-slate2'}>
                        {formatPct(r.commissionPct * 100, 1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="text-right px-3 py-2.5 tabular-nums">
                    {platform ? (
                      <span className="text-navy-dark/70">{formatCNY(r.commissionAmt)}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="text-right px-3 py-2.5">
                    <span className="font-serif text-[14px] text-navy-dark tabular-nums">
                      {formatCNY(r.net)}
                    </span>
                    <span className="block text-[10px] text-slate2 tabular-nums">
                      {netShare.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded ${t.bg} ${t.text}`}>
                      {r.marginTier}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!platform && (
        <div className="px-5 py-2 text-[11px] text-warn bg-warn/5 border-t border-warn/20">
          ⚠ Commission % per OTA must be exported manually from each portal · no consolidated view
        </div>
      )}
    </Card>
  )
}
