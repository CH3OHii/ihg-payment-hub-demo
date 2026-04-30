import { useState } from 'react'
import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { paymentChannelsFor } from '../../../data/mockFranchisee'
import { formatCNY } from '../../../lib/format'

export default function PaymentChannelMix() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const channels = paymentChannelsFor(franchiseePropertyId)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <Card
      title="Today's Payment Channels"
      subtitle="Share of GTV by rail"
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${
          platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'
        }`}>
          {platform ? 'All rails connected' : 'POS export pending'}
        </div>
      }
    >
      <div className="flex flex-col gap-3 mt-1">
        {channels.map(row => {
          const pct = Math.round(row.share * 100)
          const isHover = hovered === row.name
          return (
            <div
              key={row.name}
              className="group"
              onMouseEnter={() => setHovered(row.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="flex items-center justify-between text-[12.5px] mb-1">
                <span className="font-medium text-navy-dark">{row.name}</span>
                <span className="text-slate2 tabular-nums">
                  {isHover ? formatCNY(row.amount) : `${pct}%`}
                </span>
              </div>
              <div className="h-5 bg-slate-100 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, 1)}%`,
                    background: row.color,
                    opacity: platform ? 1 : 0.6,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {!platform && (
        <div className="mt-4 text-[11.5px] text-warn bg-warn/10 rounded-md px-3 py-2">
          ⚠ Today's mix estimated from yesterday's batch · cash drawer not yet imported.
        </div>
      )}
    </Card>
  )
}
