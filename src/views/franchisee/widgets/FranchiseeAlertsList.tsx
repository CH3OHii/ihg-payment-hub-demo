import { useState } from 'react'
import Card from '../../../components/Card'
import { useMode } from '../../../state/ModeContext'
import { alertsForProperty, type FranchiseeAlert } from '../../../data/mockFranchisee'
import { properties } from '../../../data/mock'

export default function FranchiseeAlertsList() {
  const { mode, franchiseePropertyId } = useMode()
  const alerts = alertsForProperty(franchiseePropertyId, mode)
  const [selected, setSelected] = useState<FranchiseeAlert | null>(null)

  const counts = {
    red:   alerts.filter(a => a.severity === 'red').length,
    amber: alerts.filter(a => a.severity === 'amber').length,
    green: alerts.filter(a => a.severity === 'green').length,
  }

  return (
    <>
      <Card
        title="Property Alerts"
        subtitle={`${counts.red} critical · ${counts.amber} warning · ${counts.green} cleared`}
        noPadding
      >
        <ul className="flex flex-col">
          {alerts.map(a => (
            <li
              key={a.id}
              onClick={() => setSelected(a)}
              className="flex items-start gap-3 px-5 py-3 cursor-pointer border-t border-slate-100 hover:bg-slate-50/80 transition-colors first:border-t-0"
            >
              <Dot severity={a.severity} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-navy-dark truncate">{a.title}</div>
                <div className="text-[11.5px] text-slate2 truncate">{a.body}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {selected && <AlertDrawer alert={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function Dot({ severity }: { severity: FranchiseeAlert['severity'] }) {
  const color =
    severity === 'red'   ? 'bg-danger'
    : severity === 'amber' ? 'bg-warn'
    : 'bg-success'
  return <span className={`mt-[5px] w-2 h-2 rounded-full shrink-0 ${color}`} />
}

function AlertDrawer({ alert, onClose }: { alert: FranchiseeAlert; onClose: () => void }) {
  const property = properties.find(p => p.id === alert.property_id)
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-navy-dark/30 backdrop-blur-[1px]" />
      <aside
        className="absolute right-0 top-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-slate2">Property Alert</div>
            <h3 className="font-serif text-[17px] text-navy-dark mt-1">{alert.title}</h3>
          </div>
          <button onClick={onClose} className="text-slate2 hover:text-navy-dark text-[18px] leading-none">×</button>
        </header>

        <div className="px-5 py-4 flex-1 overflow-auto flex flex-col gap-4">
          <section>
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 mb-1">Issue</div>
            <p className="text-[13.5px] text-navy-dark">{alert.body}</p>
          </section>

          {property && (
            <section>
              <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 mb-1">Property</div>
              <div className="text-[13.5px] text-navy-dark font-medium">{property.name}</div>
              <div className="text-[12px] text-slate2">{property.city} · {property.region} · {property.brand}</div>
            </section>
          )}

          <section>
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 mb-1">Recommended Action</div>
            <p className="text-[13px] text-navy-dark bg-gold/10 border border-gold/30 rounded-md p-3">
              {alert.recommended_action}
            </p>
          </section>
        </div>

        <footer className="border-t border-slate-100 p-4 flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] text-slate2 hover:bg-slate-100">Dismiss</button>
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] text-white bg-teal hover:bg-teal-dark">Resolve</button>
        </footer>
      </aside>
    </div>
  )
}
