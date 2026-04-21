import KPIRow from './overview/KPIRow'
import ChannelMix from './overview/ChannelMix'
import AlertsList from './overview/AlertsList'
import LiveFeed from './overview/LiveFeed'
import { useMode } from '../state/ModeContext'

export default function Overview() {
  const { mode } = useMode()
  const platform = mode === 'platform'

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      {/* Hero title */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight leading-none">
            HQ Treasury Dashboard
          </h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            Unified payment visibility across IHG Greater China · 623 properties
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate2">
          {platform ? 'Platform Mode · Real-time' : 'Current State · Manual aggregation'}
        </div>
      </div>

      <KPIRow />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5">
          <ChannelMix />
        </div>
        <div className="col-span-4">
          <AlertsList />
        </div>
        <div className="col-span-3">
          <LiveFeed />
        </div>
      </div>
    </div>
  )
}
