import { useMode } from '../../state/ModeContext'
import { properties } from '../../data/mock'
import {
  channelMarginsFor,
  loyaltyMemberShare,
} from '../../data/mockFranchisee'
import AnimatedNumber from '../../components/AnimatedNumber'
import { formatPct, formatCNY } from '../../lib/format'
import ChannelMarginTable from './widgets/ChannelMarginTable'
import ChannelTrend30d from './widgets/ChannelTrend30d'
import { Sparkles, Crown, Globe } from 'lucide-react'

export default function FranchiseeChannels() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const property = properties.find(p => p.id === franchiseePropertyId) ?? properties[0]
  const margins = channelMarginsFor(franchiseePropertyId, mode)
  const loyaltyShare = loyaltyMemberShare(franchiseePropertyId, mode)

  // Top-level KPIs
  const direct = margins.find(m => m.channel === 'IHG.com' || m.channel === 'IHG One Rewards app')
  const totalRev = margins.reduce((a, m) => a + m.revenue, 0)
  const totalNet = margins.reduce((a, m) => a + m.net, 0)
  const totalCommission = margins.reduce((a, m) => a + m.commissionAmt, 0)
  const blendedMargin = ((totalNet / totalRev) * 100)
  const directShare = (margins.filter(m => m.channel === 'IHG.com' || m.channel === 'IHG One Rewards app').reduce((a, m) => a + m.revenue, 0) / totalRev) * 100

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight leading-none">
            Channels & OTA Margin
          </h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            Where the bookings come from · {property.name}
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate2">
          {platform ? 'Live · commission-aware net margin' : 'Channel mix only · no commission visibility'}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <KPI
          label="Direct booking share"
          value={
            <AnimatedNumber
              value={directShare}
              duration={900}
              format={(n) => formatPct(n, 1)}
              className="font-serif text-[28px] text-navy-dark tracking-tight"
            />
          }
          sub={platform ? `+${(directShare * 0.18).toFixed(1)}% vs 30-day avg` : 'Channel mix without commission'}
          tone={platform ? 'good' : 'warn'}
          icon={<Globe size={14} className="text-success" />}
        />
        <KPI
          label="IHG One Rewards member nights"
          value={
            <AnimatedNumber
              value={loyaltyShare * 100}
              duration={900}
              format={(n) => formatPct(n, 1)}
              className="font-serif text-[28px] text-navy-dark tracking-tight"
            />
          }
          sub={platform ? 'Higher ADR · zero commission' : 'Member contribution not surfaced'}
          tone={platform ? 'good' : 'warn'}
          icon={<Crown size={14} className="text-gold" />}
        />
        <KPI
          label="OTA commission this month"
          value={
            <AnimatedNumber
              value={totalCommission}
              duration={900}
              format={formatCNY}
              className="font-serif text-[28px] text-navy-dark tracking-tight"
            />
          }
          sub={platform ? `Avg ${(totalCommission / totalRev * 100).toFixed(1)}% of revenue` : 'Computed manually from OTA reports'}
          tone={platform ? 'warn' : 'danger'}
          icon={<Sparkles size={14} className="text-warn" />}
        />
        <KPI
          label="Blended net margin"
          value={
            <AnimatedNumber
              value={blendedMargin}
              duration={900}
              format={(n) => formatPct(n, 1)}
              className="font-serif text-[28px] text-navy-dark tracking-tight"
            />
          }
          sub={direct ? `Direct margin: ${formatPct(100, 0)}` : ''}
          tone={blendedMargin >= 90 ? 'good' : 'warn'}
        />
      </div>

      <ChannelMarginTable />
      <ChannelTrend30d />

      {platform && (
        <div className="rounded-md bg-gold/10 border border-gold/30 px-4 py-3 flex items-start gap-3">
          <Sparkles size={16} className="text-gold-dark mt-0.5 shrink-0" />
          <div>
            <div className="text-[12.5px] text-navy-dark font-medium">
              Direct booking opportunity
            </div>
            <div className="text-[11.5px] text-slate2">
              Shifting 5% of OTA bookings to IHG One Rewards direct would save{' '}
              <span className="text-navy-dark font-medium tabular-nums">{formatCNY(totalCommission * 0.05)}</span>{' '}
              in commission this month. Triggered via post-stay enrollment offer.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function KPI({
  label, value, sub, tone, icon,
}: {
  label: string
  value: React.ReactNode
  sub: string
  tone: 'good' | 'warn' | 'danger'
  icon?: React.ReactNode
}) {
  const { mode } = useMode()
  const toneColor = tone === 'good' ? 'text-success' : tone === 'warn' ? 'text-warn' : 'text-danger'
  return (
    <div className={`${mode === 'platform' ? 'platform-card' : ''} bg-white rounded-card border border-slate-200/80 shadow-card p-4 flex flex-col gap-2`}>
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 flex items-center gap-1.5">
        {icon}
        {label}
      </div>
      <div>{value}</div>
      <div className={`text-[11.5px] ${toneColor}`}>{sub}</div>
    </div>
  )
}
