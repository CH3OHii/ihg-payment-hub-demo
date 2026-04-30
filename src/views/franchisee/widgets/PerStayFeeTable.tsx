import { useState } from 'react'
import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { perStayFees, type PerStayFee } from '../../../data/mockFranchisee'
import { formatCNYExact, formatPct } from '../../../lib/format'

const GUEST_COLOR: Record<PerStayFee['guestType'], string> = {
  direct:    'bg-success/15 text-success',
  OTA:       'bg-warn/15 text-warn',
  corporate: 'bg-teal/15 text-teal',
  'walk-in': 'bg-slate-200 text-slate2',
}

export default function PerStayFeeTable() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const stays = perStayFees(franchiseePropertyId, 18)
  const [selected, setSelected] = useState<PerStayFee | null>(null)

  if (!platform) {
    return (
      <Card
        title="Per-Stay Fee Attribution"
        subtitle="Drill-down by stay"
        right={
          <div className="text-[11px] px-2 py-1 rounded-md bg-warn/10 text-warn">
            Not available
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-[12.5px] text-slate2 max-w-md">
            Per-stay fee attribution is unavailable in current state.
            Fees post as a single monthly aggregate to your bank statement.
          </div>
          <div className="mt-3 text-[11.5px] text-warn">
            ⚠ Drill-down requires Platform deployment
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card
        title="Per-Stay Fee Attribution"
        subtitle="Click any row for full breakdown · last 18 stays"
        right={
          <div className="text-[11px] px-2 py-1 rounded-md bg-success/10 text-success">
            Itemized · audit-ready
          </div>
        }
        noPadding
      >
        <div className="max-h-[420px] overflow-auto">
          <table className="w-full text-[12.5px]">
            <thead className="bg-slate-50 text-slate2 text-[10.5px] uppercase tracking-[0.12em] sticky top-0">
              <tr>
                <th className="text-left px-5 py-2 font-medium">Stay</th>
                <th className="text-left px-3 py-2 font-medium">Date</th>
                <th className="text-left px-3 py-2 font-medium">Guest</th>
                <th className="text-right px-3 py-2 font-medium">Room rev</th>
                <th className="text-right px-3 py-2 font-medium">Total fee</th>
                <th className="text-right px-5 py-2 font-medium">Fee %</th>
              </tr>
            </thead>
            <tbody>
              {stays.map(s => {
                const pct = (s.total / s.roomRevenue) * 100
                return (
                  <tr
                    key={s.stayId}
                    onClick={() => setSelected(s)}
                    className="border-t border-slate-100 hover:bg-slate-50/80 cursor-pointer"
                  >
                    <td className="px-5 py-2 text-navy-dark/85 font-mono text-[11px]">{s.stayId}</td>
                    <td className="px-3 py-2 text-slate2 font-mono text-[11px]">{s.date}</td>
                    <td className="px-3 py-2">
                      <span className={`text-[10.5px] uppercase tracking-wider px-2 py-0.5 rounded ${GUEST_COLOR[s.guestType]}`}>
                        {s.guestType}
                      </span>
                      <span className="text-[10.5px] text-slate2 ml-2">{s.channel}</span>
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums text-navy-dark">
                      {formatCNYExact(s.roomRevenue)}
                    </td>
                    <td className="text-right px-3 py-2 tabular-nums text-navy-dark/80">
                      {formatCNYExact(s.total)}
                    </td>
                    <td className="text-right px-5 py-2 tabular-nums text-slate2">
                      {formatPct(pct, 2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && <StayDrawer stay={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function StayDrawer({ stay, onClose }: { stay: PerStayFee; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-navy-dark/30 backdrop-blur-[1px]" />
      <aside
        className="absolute right-0 top-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-slate2">Stay Detail</div>
            <h3 className="font-serif text-[17px] text-navy-dark mt-1">{stay.stayId}</h3>
            <div className="text-[11.5px] text-slate2">{stay.date} · {stay.guestType} · {stay.channel}</div>
          </div>
          <button onClick={onClose} className="text-slate2 hover:text-navy-dark text-[18px] leading-none">×</button>
        </header>

        <div className="px-5 py-4 flex-1 overflow-auto flex flex-col gap-4 text-[12.5px]">
          <RowGroup>
            <KV k="Room revenue" v={formatCNYExact(stay.roomRevenue)} />
          </RowGroup>
          <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 -mb-2">Fees</div>
          <RowGroup>
            <KV k="Base royalty (5%)" v={formatCNYExact(stay.base)} />
            <KV k="System / marketing (3%)" v={formatCNYExact(stay.marketing)} />
            <KV k="Technology & CRS (1.5%)" v={formatCNYExact(stay.techCrs)} />
            <KV k={`Loyalty pass-through (${stay.guestType === 'direct' ? '2.5%' : '1.5%'})`} v={formatCNYExact(stay.loyalty)} />
          </RowGroup>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-slate2">Total fees</span>
            <span className="font-serif text-[20px] text-navy-dark tabular-nums">{formatCNYExact(stay.total)}</span>
          </div>
          <div className="text-[11px] text-slate2 bg-teal/5 border border-teal/20 rounded-md px-3 py-2">
            Each line is auditable against the stay folio and posted to the merchant ledger.
          </div>
        </div>

        <footer className="border-t border-slate-100 p-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] text-navy-dark border border-slate-200 hover:bg-slate-50">
            Close
          </button>
        </footer>
      </aside>
    </div>
  )
}

function RowGroup({ children }: { children: React.ReactNode }) {
  return <div className="bg-slate-50 rounded-md p-3 flex flex-col gap-1">{children}</div>
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate2">{k}</span>
      <span className="text-navy-dark tabular-nums">{v}</span>
    </div>
  )
}
