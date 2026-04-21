import type { ReactNode } from 'react'
import { useMode } from '../state/ModeContext'

interface CardProps {
  title?: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export default function Card({ title, subtitle, right, children, className = '', noPadding }: CardProps) {
  const { mode } = useMode()
  const gold = mode === 'platform'
  return (
    <section
      className={`${gold ? 'platform-card' : ''} bg-white rounded-card border border-slate-200/80 shadow-card flex flex-col ${className}`}
    >
      {(title || right) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-4 pb-2">
          <div>
            {title && (
              <h3 className="font-serif text-[15px] text-navy-dark tracking-wide">{title}</h3>
            )}
            {subtitle && (
              <p className="text-[11.5px] text-slate2 mt-0.5">{subtitle}</p>
            )}
          </div>
          {right}
        </header>
      )}
      <div className={noPadding ? '' : 'px-5 pb-4 flex-1'}>{children}</div>
    </section>
  )
}
