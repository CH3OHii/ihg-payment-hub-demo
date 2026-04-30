import { ChevronDown } from 'lucide-react'
import { useMode } from '../state/ModeContext'
import { properties } from '../data/mock'

// Dropdown letting the franchisee user "log in as" a different property mid-demo.
export default function PropertyPicker() {
  const { franchiseePropertyId, setFranchiseePropertyId } = useMode()
  const current = properties.find(p => p.id === franchiseePropertyId) ?? properties[0]

  return (
    <div className="relative">
      <select
        value={franchiseePropertyId}
        onChange={e => setFranchiseePropertyId(e.target.value)}
        className="appearance-none bg-transparent text-offwhite/85 text-[12px] pr-5 pl-1 py-0.5 rounded outline-none border-none cursor-pointer hover:text-offwhite focus:text-offwhite"
        aria-label="Select property"
      >
        {properties.map(p => (
          <option key={p.id} value={p.id} className="text-navy-dark">
            {p.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={11}
        strokeWidth={2.2}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-offwhite/60 pointer-events-none"
      />
      <div className="text-[10px] uppercase tracking-[0.18em] text-offwhite/50 mt-0.5 leading-none">
        {current.brand} · {current.city} · Franchisee
      </div>
    </div>
  )
}
