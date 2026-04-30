import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { feesThisMonth } from '../../../data/mockFranchisee'
import AnimatedNumber from '../../../components/AnimatedNumber'
import { formatCNY } from '../../../lib/format'
import { ArrowDownUp, Info } from 'lucide-react'

export default function FXDisclosure() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const f = feesThisMonth(franchiseePropertyId)
  const spread = ((f.fxRateUsed - f.fxMidRate) / f.fxMidRate) * 10000 // basis points
  const usdAmount = f.total / f.fxRateUsed
  const ifAtMidRate = f.total / f.fxMidRate
  const fxCost = (ifAtMidRate - usdAmount) * f.fxRateUsed

  return (
    <Card
      title="USD Remittance · FX Disclosure"
      subtitle="Royalty remittance to IHG HQ"
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {platform ? 'Locked at remittance · audit trail' : 'Rate posted by HQ · spread not disclosed'}
        </div>
      }
    >
      <div className="flex flex-col gap-3 mt-1">
        <div className="grid grid-cols-3 gap-2">
          <RateBox label="Rate used" value={f.fxRateUsed} tone="navy" />
          <RateBox label="PBOC mid" value={f.fxMidRate} tone="teal" />
          <RateBox
            label="Spread"
            value={spread}
            tone={spread < 10 ? 'success' : 'warn'}
            suffix="bp"
            format={n => `${n.toFixed(1)}`}
          />
        </div>

        <div className="rounded-md bg-slate-50 px-3 py-3 flex items-center gap-3">
          <ArrowDownUp size={16} className="text-slate2 shrink-0" />
          <div className="flex-1 text-[12px]">
            <div className="text-slate2 mb-0.5">Estimated FX cost this month</div>
            <div className="font-serif text-[18px] text-navy-dark tabular-nums">
              <AnimatedNumber
                value={Math.max(0, fxCost)}
                duration={900}
                format={formatCNY}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11.5px] text-slate2 bg-teal/5 border border-teal/20 rounded-md px-3 py-2">
          <Info size={13} className="text-teal shrink-0 mt-0.5" />
          <span>
            {platform
              ? `Rate locked at remittance time (≈$${usdAmount.toFixed(0)}). Spread is logged with PBOC mid-rate timestamp for audit.`
              : 'Rate is posted by HQ at month-end. Difference vs PBOC mid is not separately disclosed on the statement.'}
          </span>
        </div>
      </div>
    </Card>
  )
}

function RateBox({
  label, value, tone, format, suffix,
}: {
  label: string
  value: number
  tone: 'navy' | 'teal' | 'success' | 'warn'
  format?: (n: number) => string
  suffix?: string
}) {
  const colors: Record<string, string> = {
    navy: 'text-navy-dark',
    teal: 'text-teal',
    success: 'text-success',
    warn: 'text-warn',
  }
  const fmt = format ?? ((n: number) => n.toFixed(3))
  return (
    <div className="flex flex-col gap-1 px-3 py-2 rounded-md bg-slate-50 border border-slate-100">
      <span className="text-[10.5px] uppercase tracking-[0.14em] text-slate2">{label}</span>
      <span className={`font-serif text-[18px] tabular-nums ${colors[tone]}`}>
        {fmt(value)}{suffix && <span className="text-[12px] text-slate2 ml-0.5">{suffix}</span>}
      </span>
    </div>
  )
}
