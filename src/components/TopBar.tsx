import { useEffect, useState } from 'react'
import { useMode } from '../state/ModeContext'
import { Hotel } from 'lucide-react'

export default function TopBar() {
  const { mode, toggleMode } = useMode()
  const isPlatform = mode === 'platform'

  // Simulated "updated X seconds ago" ticker in Platform mode.
  const [agoTick, setAgoTick] = useState(0)
  useEffect(() => {
    if (!isPlatform) return
    const iv = setInterval(() => setAgoTick(t => (t + 1) % 10), 800)
    return () => clearInterval(iv)
  }, [isPlatform])

  return (
    <header className="h-16 bg-navy text-offwhite border-b border-navy-mid/50 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy-dark">
          <Hotel size={18} strokeWidth={2.3} />
        </div>
        <div className="leading-tight">
          <div className="font-serif text-[17px] tracking-wide">
            IHG Greater China · <span className="text-gold">Payment Hub</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-offwhite/60">
            Treasury View
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div
          className={`flex items-center gap-3 h-9 pl-1.5 pr-3 rounded-full border cursor-pointer select-none transition-colors ${
            isPlatform ? 'border-gold/40 bg-navy-mid/30' : 'border-offwhite/20 bg-navy-dark'
          }`}
          onClick={toggleMode}
          role="button"
          aria-label="Toggle demo mode"
        >
          <SegmentLabel active={!isPlatform} label="Today (Current State)" />
          <SegmentLabel active={isPlatform}  label="Platform (Future State)" />
        </div>

        <div className="flex items-center gap-2 text-[12px] text-offwhite/70 min-w-[170px] justify-end">
          {isPlatform ? (
            <>
              <span className="w-2 h-2 rounded-full bg-success animate-pulseDot" />
              <span>Live · Updated {(0.4 + (agoTick % 3) * 0.3).toFixed(1)}s ago</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-warn" />
              <span>Last synced: yesterday 23:47</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function SegmentLabel({ active, label }: { active: boolean; label: string }) {
  return (
    <div
      className={`px-3 h-7 rounded-full flex items-center text-[12px] font-medium transition-colors ${
        active ? 'bg-gold text-navy-dark' : 'text-offwhite/70'
      }`}
    >
      {label}
    </div>
  )
}
