import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { channelTrend30d } from '../../../data/mockFranchisee'
import { formatCNY } from '../../../lib/format'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SERIES: { key: 'direct' | 'ctrip' | 'meituan' | 'fliggy' | 'booking' | 'walkIn'; label: string; color: string }[] = [
  { key: 'direct',  label: 'Direct (IHG.com / app)', color: '#16A34A' },
  { key: 'ctrip',   label: 'Ctrip',                  color: '#028090' },
  { key: 'meituan', label: 'Meituan',                color: '#F59E0B' },
  { key: 'fliggy',  label: 'Fliggy',                 color: '#C9A961' },
  { key: 'booking', label: 'Booking.com',            color: '#94A3B8' },
  { key: 'walkIn',  label: 'Walk-in',                color: '#64748B' },
]

export default function ChannelTrend30d() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const data = channelTrend30d(franchiseePropertyId)

  return (
    <Card
      title="30-Day Channel Trend"
      subtitle="Stacked revenue by booking source"
      right={
        <div className="flex items-center gap-3">
          {SERIES.map(s => (
            <span key={s.key} className="flex items-center gap-1 text-[10.5px] text-slate2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              {s.label.split(' ')[0]}
            </span>
          ))}
        </div>
      }
    >
      <div className="h-[260px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <defs>
              {SERIES.map(s => (
                <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.10} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 10 }} interval={4} />
            <YAxis
              stroke="#64748B"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => formatCNY(v)}
              width={60}
            />
            <Tooltip content={<ChartTooltip />} />
            {SERIES.map(s => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stackId="1"
                stroke={s.color}
                strokeWidth={1.4}
                fill={`url(#grad-${s.key})`}
                animationDuration={platform ? 700 : 1200}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

interface TooltipPayloadItem {
  name?: string
  dataKey?: string
  value?: number
  color?: string
}

function ChartTooltip(props: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  const { active, payload, label } = props
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-md px-3 py-2 text-[11.5px]">
      <div className="font-mono text-slate2 mb-1">{label}</div>
      {[...payload].reverse().map((p, i) => (
        <div key={p.dataKey ?? p.name ?? i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-navy-dark/85">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {SERIES.find(s => s.key === p.dataKey)?.label ?? p.name}
          </span>
          <span className="tabular-nums text-navy-dark">{formatCNY(p.value ?? 0)}</span>
        </div>
      ))}
    </div>
  )
}
