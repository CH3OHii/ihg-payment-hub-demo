import { useEffect } from 'react'
import TopBar from './components/TopBar'
import SideNav from './components/SideNav'
import Overview from './views/Overview'
import MapView from './views/MapView'
import Properties from './views/Properties'
import Reconciliation from './views/Reconciliation'
import { ModeProvider, useMode, type ViewId } from './state/ModeContext'

function Shell() {
  const { view, setView, toggleMode } = useMode()

  // Keyboard shortcuts: T = toggle mode, 1..4 = switch view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
      if (target?.isContentEditable) return

      if (e.key === 't' || e.key === 'T') { toggleMode(); return }
      const map: Record<string, ViewId> = {
        '1': 'overview',
        '2': 'map',
        '3': 'properties',
        '4': 'reconciliation',
      }
      const v = map[e.key]
      if (v) setView(v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setView, toggleMode])

  return (
    <div className="h-screen flex flex-col bg-offwhite overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-auto">
          {view === 'overview' && <Overview />}
          {view === 'map' && <MapView />}
          {view === 'properties' && <Properties />}
          {view === 'reconciliation' && <Reconciliation />}
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
