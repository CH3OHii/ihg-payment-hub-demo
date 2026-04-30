import { useEffect } from 'react'
import TopBar from './components/TopBar'
import SideNav from './components/SideNav'
import Overview from './views/Overview'
import MapView from './views/MapView'
import Properties from './views/Properties'
import Reconciliation from './views/Reconciliation'
import FranchiseeOverview from './views/franchisee/FranchiseeOverview'
import FranchiseeSettlements from './views/franchisee/FranchiseeSettlements'
import FranchiseeFees from './views/franchisee/FranchiseeFees'
import FranchiseeChannels from './views/franchisee/FranchiseeChannels'
import {
  ModeProvider,
  useMode,
  type ViewId,
  type HQViewId,
  type FranchiseeViewId,
} from './state/ModeContext'

const HQ_KEY_MAP: Record<string, HQViewId> = {
  '1': 'overview',
  '2': 'map',
  '3': 'properties',
  '4': 'reconciliation',
}

const FR_KEY_MAP: Record<string, FranchiseeViewId> = {
  '1': 'fr-overview',
  '2': 'fr-settlements',
  '3': 'fr-fees',
  '4': 'fr-channels',
}

function Shell() {
  const { view, setView, toggleMode, togglePersona, persona } = useMode()

  // Keyboard shortcuts: T = toggle mode, P = toggle persona, 1-4 = view (per persona).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (target?.isContentEditable) return

      if (e.key === 't' || e.key === 'T') { toggleMode(); return }
      if (e.key === 'p' || e.key === 'P') { togglePersona(); return }

      const map = persona === 'hq' ? HQ_KEY_MAP : FR_KEY_MAP
      const v: ViewId | undefined = map[e.key]
      if (v) setView(v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setView, toggleMode, togglePersona, persona])

  return (
    <div className="h-screen flex flex-col bg-offwhite overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-auto">
          {/* HQ views */}
          {view === 'overview' && <Overview />}
          {view === 'map' && <MapView />}
          {view === 'properties' && <Properties />}
          {view === 'reconciliation' && <Reconciliation />}
          {/* Franchisee views */}
          {view === 'fr-overview' && <FranchiseeOverview />}
          {view === 'fr-settlements' && <FranchiseeSettlements />}
          {view === 'fr-fees' && <FranchiseeFees />}
          {view === 'fr-channels' && <FranchiseeChannels />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ModeProvider>
      <Shell />
    </ModeProvider>
  )
}
