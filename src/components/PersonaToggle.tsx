import { useMode } from '../state/ModeContext'
import { Building2, Hotel } from 'lucide-react'

// Outline-style segmented pill — visually distinct from the filled mode toggle.
export default function PersonaToggle() {
  const { persona, setPersona } = useMode()
  const isFranchisee = persona === 'franchisee'

  return (
    <div
      className="flex items-center gap-1 h-9 p-1 rounded-full border border-offwhite/25 select-none"
      role="group"
      aria-label="Persona switcher"
    >
      <Segment
        active={!isFranchisee}
        label="Headquarters"
        icon={<Building2 size={13} strokeWidth={2.2} />}
        onClick={() => setPersona('hq')}
      />
      <Segment
        active={isFranchisee}
        label="Property"
        icon={<Hotel size={13} strokeWidth={2.2} />}
        onClick={() => setPersona('franchisee')}
      />
    </div>
  )
}

function Segment({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11.5px] font-medium tracking-wide transition-colors ${
        active
          ? 'bg-offwhite/10 text-offwhite border border-offwhite/30'
          : 'text-offwhite/55 hover:text-offwhite/80 border border-transparent'
      }`}
    >
      {icon}
      <span className="uppercase tracking-[0.08em]">{label}</span>
    </button>
  )
}
