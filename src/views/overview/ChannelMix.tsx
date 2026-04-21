import { useState } from 'react'
import Card from '../../components/Card'
import { channelMix } from '../../data/mock'
import { useMode } from '../../state/ModeContext'
import { formatCNY } from '../../lib/format'

export default function ChannelMix() {
  const { mode } = useMode()
  const [hovered, setHovered] = useState<string | null>(null)
  const platform = mode === 'platform'

  return (
    <Card
      title="Channel Mix"
      subtitle="Last 24 hours · share of GTV"
      right={
        <div className={`text-[11px] px-2 py-1 rounded-md ${platform ? 'bg-success/10 text-success' : 'bg-warn/10 text-warn'}`}>
          {platform ? 'All rails connected' : '3 properties missing data'}
        </div>
      }
    >
      <div className="flex flex-col gap-3 mt-1">
        {channelMix.map(row => {
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
              <div className="h-5 bg-slate-100 rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    background: row.color,
                    opacity: platform ? 1 : 0.75,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {!platform && (
        <div className="mt-4 text-[11.5px] text-warn bg-warn/10 rounded-md px-3 py-2">
          ⚠ Figures aggregated from weekly property reports. 3 properties missing end-of-day batch.
        </div>
      )}
    </Card>
  )
}
