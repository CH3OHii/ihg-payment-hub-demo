import { useMode } from '../../state/ModeContext'
import { properties } from '../../data/mock'
import SettlementChannelTable from './widgets/SettlementChannelTable'
import AgingBuckets from './widgets/AgingBuckets'
import DualFileMatch from './widgets/DualFileMatch'

export default function FranchiseeSettlements() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const property = properties.find(p => p.id === franchiseePropertyId) ?? properties[0]

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight leading-none">
            Settlements & Cash Flow
          </h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            Pending across rails · {property.name}
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate2">
          {platform ? 'Auto-reconciled · live' : 'Weekly settlement files · manual review'}
        </div>
      </div>

      <SettlementChannelTable />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <AgingBuckets />
        </div>
        <div className="col-span-5">
          <DualFileMatch />
        </div>
      </div>
    </div>
  )
}
