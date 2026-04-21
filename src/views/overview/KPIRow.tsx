import { useEffect, useState } from 'react'
import AnimatedNumber from '../../components/AnimatedNumber'
import { kpiCurrent, kpiPlatform } from '../../data/mock'
import { useMode } from '../../state/ModeContext'
import { formatCNY, formatPct } from '../../lib/format'

export default function KPIRow() {
  const { mode } = useMode()
  const platform = mode === 'platform'
  const snap = platform ? kpiPlatform : kpiCurrent

  // In Platform mode, tick GTV upward every 2-3 seconds by ¥40k-¥200k.
  // This is the "dashboard feels alive" micro-interaction.
  const [gtvDelta, setGtvDelta] = useState(0)
  useEffect(() => {
    if (!platform) { setGtvDelta(0); return }
    const iv = setInterval(() => {
      setGtvDelta(d => d + 40_000 + Math.floor(Math.random() * 160_000))
    }, 2_400)
    return () => clearInterval(iv)
  }, [platform])

  const gtv = snap.gtv + (platform ? gtvDelta : 0)

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
        sub={platform ? 'Streaming · all rails' : 'Data aggregated manually — 3 properties missing'}
        subTone={platform ? 'good' : 'warn'}
      />
      <KPITile
        label="Properties Reporting"
        value={
          <span className="font-serif text-[30px] text-navy-dark tracking-tight">
            <AnimatedNumber value={snap.propertiesReporting} duration={900} />
            <span className="text-slate2 font-sans text-[20px]"> / {snap.propertiesTotal}</span>
          </span>
        }
        sub={platform ? 'Real-time telemetry from POS + PMS' : `${snap.propertiesTotal - snap.propertiesReporting} properties not reporting today`}
        subTone={platform ? 'good' : 'warn'}
      />
      <KPITile
        label="Compliance Rate"
        value={
          <AnimatedNumber
            value={snap.complianceRate}
            duration={900}
            format={(n) => formatPct(n, 1)}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={platform ? 'PCI · KYC · audit gates current' : '12 open compliance flags across portfolio'}
        subTone={platform ? 'good' : 'warn'}
      />
      <KPITile
        label="Pending OTA Reconciliation"
        value={
          <AnimatedNumber
            value={snap.pendingReconciliation}
            duration={900}
            format={formatCNY}
            className="font-serif text-[30px] text-navy-dark tracking-tight"
          />
        }
        sub={platform ? 'Avg. clearing time: 18 hours' : 'Avg. clearing time: 14 days'}
        subTone={platform ? 'good' : 'danger'}
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
