import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { dualFileMatchFor } from '../../../data/mockFranchisee'
import AnimatedNumber from '../../../components/AnimatedNumber'
import { CheckCircle2, AlertTriangle, FileText } from 'lucide-react'

export default function DualFileMatch() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const m = dualFileMatchFor(franchiseePropertyId, mode)

  return (
    <Card
      title="WeChat Dual-File Reconciliation"
      subtitle="Merchant export vs WeChat settlement file"
      right={
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className={`w-1.5 h-1.5 rounded-full ${platform ? 'bg-success animate-pulseDot' : 'bg-warn'}`} />
          <span className={platform ? 'text-success' : 'text-warn'}>
            Last sync: {m.lastSyncLabel}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-4 mt-1">
        {/* File pair viz */}
        <div className="col-span-2 flex flex-col gap-2">
          <FileBar
            label="Merchant export (PMS folio)"
            count={m.merchantLines}
            color="bg-teal"
            tone="ok"
          />
          <FileBar
            label="WeChat settlement file"
            count={m.weChatSettlementLines}
            color="bg-mint"
            tone="ok"
          />
          <div className="flex items-center justify-between mt-2 px-3 py-2 rounded-md bg-slate-50">
            <span className="text-[11.5px] text-slate2">Auto-match rate</span>
            <span className={`font-serif text-[18px] tabular-nums ${
              platform ? 'text-success' : 'text-warn'
            }`}>
              <AnimatedNumber value={m.autoMatchPct} duration={900} format={(n) => `${n.toFixed(1)}%`} />
            </span>
          </div>
        </div>

        {/* Match summary */}
        <div className="flex flex-col gap-2">
          <SummaryRow
            label="Matched"
            count={m.matched}
            tone="good"
            icon={<CheckCircle2 size={13} className="text-success" />}
          />
          <SummaryRow
            label="Unmatched"
            count={m.unmatched}
            tone={platform ? 'warn' : 'danger'}
            icon={<AlertTriangle size={13} className={platform ? 'text-warn' : 'text-danger'} />}
          />
          <div className={`mt-1 text-[11.5px] rounded-md px-3 py-2 ${
            platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
          }`}>
            {m.reviewerNote}
          </div>
        </div>
      </div>
    </Card>
  )
}

function FileBar({ label, count, color, tone: _ }: { label: string; count: number; color: string; tone: 'ok' }) {
  return (
    <div className="flex items-center gap-3">
      <FileText size={14} className="text-slate2 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[11.5px] text-navy-dark mb-0.5">{label}</div>
        <div className="h-3 bg-slate-100 rounded-md overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-700`}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      <div className="font-mono text-[11.5px] tabular-nums text-navy-dark/80 shrink-0 w-12 text-right">
        {count}
      </div>
    </div>
  )
}

function SummaryRow({
  label, count, tone, icon,
}: {
  label: string; count: number; tone: 'good' | 'warn' | 'danger'; icon: React.ReactNode
}) {
  const text = tone === 'good' ? 'text-success' : tone === 'warn' ? 'text-warn' : 'text-danger'
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50">
      <span className="flex items-center gap-1.5 text-[11.5px] text-slate2">
        {icon}
        {label}
      </span>
      <span className={`font-serif text-[18px] tabular-nums ${text}`}>
        <AnimatedNumber value={count} duration={700} />
      </span>
    </div>
  )
}
