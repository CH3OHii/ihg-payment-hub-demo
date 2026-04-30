import {
  LayoutDashboard,
  Map,
  Building2,
  FileSpreadsheet,
  Wallet,
  Receipt,
  Network,
} from 'lucide-react'
import { useMode, type ViewId, type HQViewId, type FranchiseeViewId } from '../state/ModeContext'

interface NavItem {
  id: ViewId
  label: string
  keyHint: string
  icon: typeof LayoutDashboard
}

const hqItems: NavItem[] = [
  { id: 'overview',       label: 'Overview',       keyHint: '1', icon: LayoutDashboard },
  { id: 'map',            label: 'Map',            keyHint: '2', icon: Map },
  { id: 'properties',     label: 'Properties',     keyHint: '3', icon: Building2 },
  { id: 'reconciliation', label: 'Reconciliation', keyHint: '4', icon: FileSpreadsheet },
]

const franchiseeItems: NavItem[] = [
  { id: 'fr-overview',    label: 'My Hotel',     keyHint: '1', icon: LayoutDashboard },
  { id: 'fr-settlements', label: 'Settlements',  keyHint: '2', icon: Wallet },
  { id: 'fr-fees',        label: 'Fees',         keyHint: '3', icon: Receipt },
  { id: 'fr-channels',    label: 'Channels',     keyHint: '4', icon: Network },
]

export default function SideNav() {
  const { view, setView, persona } = useMode()
  const items = persona === 'hq' ? hqItems : franchiseeItems

  return (
    <nav className="w-60 shrink-0 bg-navy-dark text-offwhite border-r border-navy-mid/40 flex flex-col">
      <div className="px-5 pt-6 pb-4 text-[11px] uppercase tracking-[0.18em] text-offwhite/50">
        {persona === 'hq' ? 'Navigation' : 'Property View'}
      </div>

      <ul className="flex flex-col gap-1 px-3">
        {items.map(item => {
          const Icon = item.icon
          const active = view === item.id
          return (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`group w-full flex items-center gap-3 px-3 h-10 rounded-md text-[13.5px] transition-colors ${
                  active
                    ? 'bg-navy-mid/60 text-gold border-l-2 border-gold'
                    : 'text-offwhite/75 hover:text-offwhite hover:bg-navy-mid/30 border-l-2 border-transparent'
                }`}
              >
                <Icon size={16} strokeWidth={2} />
                <span className="flex-1 text-left">{item.label}</span>
                <span className="text-[10px] font-mono text-offwhite/40 px-1.5 py-0.5 rounded border border-offwhite/15">
                  {item.keyHint}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto p-5 text-[11px] text-offwhite/45 leading-relaxed">
        Prototype · Pitch demo<br />
        Press <span className="font-mono text-offwhite/70">T</span> for mode ·{' '}
        <span className="font-mono text-offwhite/70">P</span> for persona
      </div>
    </nav>
  )
}

// Type guards re-exported for consumers that need them
export type { HQViewId, FranchiseeViewId }
