import { useMode } from '../../state/ModeContext'
import { properties } from '../../data/mock'
import FranchiseeKPIRow from './widgets/FranchiseeKPIRow'
import CompliancePill from './widgets/CompliancePill'
import PaymentChannelMix from './widgets/PaymentChannelMix'
import CashPositionCard from './widgets/CashPositionCard'
import FranchiseeAlertsList from './widgets/FranchiseeAlertsList'
import LiveFeed from '../overview/LiveFeed'

export default function FranchiseeOverview() {
  const { mode, franchiseePropertyId } = useMode()
  const platform = mode === 'platform'
  const property = properties.find(p => p.id === franchiseePropertyId) ?? properties[0]

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      {/* Hero */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight leading-none">
            {property.name}
          </h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            {property.brand} · {property.city} · {property.region} · Franchise property dashboard
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.16em] text-slate2">
          {platform ? 'Platform Mode · Real-time' : 'Current State · Manual aggregation'}
        </div>
      </div>

      <FranchiseeKPIRow />

      <CompliancePill />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5">
          <PaymentChannelMix />
        </div>
        <div className="col-span-4">
          <CashPositionCard />
        </div>
        <div className="col-span-3">
          <LiveFeed
            propertyId={franchiseePropertyId}
            title={platform ? 'My Live Feed' : 'My Transaction Log'}
            subtitle={platform ? 'This property · streaming' : 'End-of-day batch · this property only'}
          />
        </div>
      </div>

      <FranchiseeAlertsList />
    </div>
  )
}
