import { createContext, useContext, useState, type ReactNode } from 'react'

export type Mode = 'current' | 'platform'
export type ViewId = 'overview' | 'map' | 'properties' | 'reconciliation'

interface ModeState {
  mode: Mode
  setMode: (m: Mode) => void
  toggleMode: () => void
  view: ViewId
  setView: (v: ViewId) => void
  activePropertyId: string | null
  setActivePropertyId: (id: string | null) => void
}

const ModeContext = createContext<ModeState | null>(null)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('platform')
  const [view, setView] = useState<ViewId>('overview')
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null)

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode: () => setMode(m => (m === 'platform' ? 'current' : 'platform')),
        view,
        setView,
        activePropertyId,
        setActivePropertyId,
      }}
    >
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used inside <ModeProvider>')
  return ctx
}
