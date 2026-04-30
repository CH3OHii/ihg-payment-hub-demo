import { useEffect, useState } from 'react'
import AnimatedNumber from '../../../components/AnimatedNumber'
import { useMode } from '../../../state/ModeContext'
import { franchiseeKPIs } from '../../../data/mockFranchisee'
import { formatCNY, formatCNYExact, formatPct } from '../../../lib/format'

export default function FranchiseeKPIRow() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const k = franchiseeKPIs(franchiseePropertyId, mode)

  // Tick GTV upward in platform mode (¥800-3000 per tick — smaller property)
  const [gtvDelta, setGtvDelta] = useState(0)
  useEffect(() => {
    if (!platform) { setGtvDelta(0); return }
    const iv = setInterval(() => {
      setGtvDelta(d => d + 800 + Math.floor(Math.random() * 2200))
    }, 2_400)
    return () => clearInterval(iv)
  }, [platform])
  const gtv = k.todayGTV + (platform ? gtvDelta : 0)

  return (
    <div className="grid grid-cols-4 gap-4">
      <KPITile
        label="Today's GTV"
        value={
          <AnimatedNumber
            value={gtv}
            duration={platform ? 600 : 1100}
            format={formatCNY}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={platform ? 'Live · all rails reporting' : 'Yesterday\'s batch · cash drawer pending'}
        subTone={platform ? 'good' : 'warn'}
      />
      <KPITile
        label="ADR"
        value={
          <AnimatedNumber
            value={k.adr}
            duration={900}
            format={formatCNYExact}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={`30-day avg ${formatCNYExact(k.adr30dAvg)}`}
        subTone={k.adr >= k.adr30dAvg ? 'good' : 'warn'}
      />
      <KPITile
        label="RevPAR"
        value={
          <AnimatedNumber
            value={k.revpar}
            duration={900}
            format={formatCNYExact}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={`30-day avg ${formatCNYExact(k.revpar30dAvg)}`}
        subTone={k.revpar >= k.revpar30dAvg ? 'good' : 'warn'}
      />
      <KPITile
        label="Occupancy"
        value={
          <AnimatedNumber
            value={k.occupancy * 100}
            duration={900}
            format={(n) => formatPct(n, 1)}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={`30-day avg ${formatPct(k.occupancy30dAvg * 100, 1)}`}
        subTone={k.occupancy >= k.occupancy30dAvg ? 'good' : 'warn'}
      />
    </div>
  )
}

function KPITile({
  label, value, sub, subTone,
}: {
  label: string
  value: React.ReactNode
  sub: string
  subTone: 'good' | 'warn' | 'danger'
}) {
  const { mode } = useMode()
  const toneColor = subTone === 'good' ? 'text-success' : subTone === 'warn' ? 'text-warn' : 'text-danger'
  return (
    <div className={`${mode === 'platform' ? 'platform-card' : ''} bg-white rounded-card border border-slate-200/80 shadow-card p-4 flex flex-col gap-2`}>
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate2">{label}</div>
      <div>{value}</div>
      <div className={`text-[11.5px] ${toneColor}`}>{sub}</div>
    </div>
  )
}
