import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Mode = 'current' | 'platform'
export type Persona = 'hq' | 'franchisee'

export type HQViewId = 'overview' | 'map' | 'properties' | 'reconciliation'
export type FranchiseeViewId = 'fr-overview' | 'fr-settlements' | 'fr-fees' | 'fr-channels'
export type ViewId = HQViewId | FranchiseeViewId

export const HQ_VIEWS: HQViewId[] = ['overview', 'map', 'properties', 'reconciliation']
export const FRANCHISEE_VIEWS: FranchiseeViewId[] = ['fr-overview', 'fr-settlements', 'fr-fees', 'fr-channels']

const DEFAULT_FRANCHISEE_PROPERTY = 'p06' // Holiday Inn Beijing Sanyuan

interface ModeState {
  mode: Mode
  setMode: (m: Mode) => void
  toggleMode: () => void

  persona: Persona
  setPersona: (p: Persona) => void
  togglePersona: () => void

  view: ViewId
  setView: (v: ViewId) => void

  // HQ drilldown (separate from franchisee identity)
  activePropertyId: string | null
  setActivePropertyId: (id: string | null) => void

  // Franchisee identity — never null
  franchiseePropertyId: string
  setFranchiseePropertyId: (id: string) => void
}

const ModeContext = createContext<ModeState | null>(null)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('platform')
  const [persona, setPersonaState] = useState<Persona>('hq')
  const [view, setView] = useState<ViewId>('overview')
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null)
  const [franchiseePropertyId, setFranchiseePropertyId] = useState<string>(DEFAULT_FRANCHISEE_PROPERTY)

  // Switching persona resets to that persona's first view; mode is preserved.
  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p)
    setView(p === 'hq' ? 'overview' : 'fr-overview')
  }, [])

  const togglePersona = useCallback(() => {
    setPersonaState(prev => {
      const next: Persona = prev === 'hq' ? 'franchisee' : 'hq'
      setView(next === 'hq' ? 'overview' : 'fr-overview')
      return next
    })
  }, [])

  return (
    <ModeContext.Provider
      value={{
        mode,
        setMode,
        toggleMode: () => setMode(m => (m === 'platform' ? 'current' : 'platform')),
        persona,
        setPersona,
        togglePersona,
        view,
        setView,
        activePropertyId,
        setActivePropertyId,
        franchiseePropertyId,
        setFranchiseePropertyId,
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
