import { useMode } from '../../state/ModeContext'
import { properties } from '../../data/mock'
import FeeBreakdownStack from './widgets/FeeBreakdownStack'
import FXDisclosure from './widgets/FXDisclosure'
import PerStayFeeTable from './widgets/PerStayFeeTable'
import DisputeLog from './widgets/DisputeLog'

export default function FranchiseeFees() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const property = properties.find(p => p.id === franchiseePropertyId) ?? properties[0]

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight leading-none">
            Fees & Royalties
          </h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            What you pay IHG · {property.name}
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate2">
          {platform ? 'Itemized · live · drillable' : 'Monthly statement · single-line debit'}
        </div>
      </div>

      <FeeBreakdownStack />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <PerStayFeeTable />
        </div>
        <div className="col-span-5 flex flex-col gap-5">
          <FXDisclosure />
          <DisputeLog />
        </div>
      </div>
    </div>
  )
}
