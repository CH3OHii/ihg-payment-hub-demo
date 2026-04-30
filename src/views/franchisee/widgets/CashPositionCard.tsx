import Card from '../../../components/Card'
import AnimatedNumber from '../../../components/AnimatedNumber'
import { useMode } from '../../../state/ModeContext'
import { franchiseeKPIs } from '../../../data/mockFranchisee'
import { formatCNY } from '../../../lib/format'
import { Wallet, Clock, Lock } from 'lucide-react'

export default function CashPositionCard() {
  const { mode, franchiseePropertyId } = useMode()
  const k = franchiseeKPIs(franchiseePropertyId, mode)
  const total = k.cashSettled + k.cashPending + k.cashHeldByOTA
  const settledPct = (k.cashSettled / total) * 100
  const pendingPct = (k.cashPending / total) * 100
  const otaPct = (k.cashHeldByOTA / total) * 100

  return (
    <Card
      title="Cash Position"
      subtitle="Where today's revenue is right now"
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          mode === 'platform' ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {mode === 'platform' ? 'Live · auto-reconciled' : 'Last refresh 12+ hr ago'}
        </div>
      }
    >
      <div className="flex flex-col gap-4 mt-1">
        <Row
          icon={<Wallet size={14} className="text-success" />}
          label="Settled to your bank"
          value={k.cashSettled}
          color="bg-success"
          pct={settledPct}
          tone="good"
        />
        <Row
          icon={<Clock size={14} className="text-teal" />}
          label="Pending in clearing"
          value={k.cashPending}
          color="bg-teal"
          pct={pendingPct}
          tone="ok"
        />
        <Row
          icon={<Lock size={14} className="text-warn" />}
          label="Held by OTAs"
          value={k.cashHeldByOTA}
          color="bg-warn"
          pct={otaPct}
          tone="warn"
        />
      </div>
      {mode === 'current' && (
        <div className="mt-4 text-[11.5px] text-warn bg-warn/10 rounded-md px-3 py-2">
          ⚠ Settlement file arrives weekly · OTA hold dates not transparent.
        </div>
      )}
    </Card>
  )
}

function Row({
  icon, label, value, color, pct, tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
  pct: number
  tone: 'good' | 'ok' | 'warn'
}) {
  const toneText = tone === 'good' ? 'text-success' : tone === 'ok' ? 'text-teal' : 'text-warn'
  return (
    <div>
      <div className="flex items-center justify-between text-[12.5px] mb-1">
        <span className="font-medium text-navy-dark flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <AnimatedNumber
          value={value}
          duration={800}
          format={formatCNY}
          className={`font-serif text-[16px] tabular-nums ${toneText}`}
        />
      </div>
      <div className="h-2 bg-slate-100 rounded-md overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10.5px] text-slate2 mt-0.5">{pct.toFixed(0)}% of today's revenue</div>
    </div>
  )
}
