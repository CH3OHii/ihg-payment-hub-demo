import Card from '../components/Card'
import { properties, channelMix, trend30d, alerts } from '../data/mock'
import { useMode } from '../state/ModeContext'
import { formatCNY } from '../lib/format'
import { ChevronRight } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts'
import LiveFeed from './overview/LiveFeed'

export default function Properties() {
  const { activePropertyId, setActivePropertyId } = useMode()
  const selected = properties.find(p => p.id === activePropertyId) ?? null

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-[26px] text-navy-dark tracking-tight">Properties</h1>
          <p className="text-[12.5px] text-slate2 mt-1">
            {selected ? 'Viewing property detail' : `20 largest properties by today's GTV`}
          </p>
        </div>
        {selected && (
          <button
            onClick={() => setActivePropertyId(null)}
            className="text-[12px] text-slate2 hover:text-navy-dark underline underline-offset-2"
          >
            ← Back to list
          </button>
        )}
      </div>

      {!selected ? <PropertiesTable /> : <PropertyDetail propertyId={selected.id} />}
    </div>
  )
}

function PropertiesTable() {
  const { setActivePropertyId } = useMode()
  const rows = [...properties].sort((a, b) => b.today_gtv - a.today_gtv)

  const openAlerts = (id: string) => alerts.filter(a => a.property_id === id && a.severity !== 'green').length

  return (
    <Card noPadding>
      <table className="w-full text-[12.5px]">
        <thead className="border-b border-slate-200 text-slate2">
          <tr className="text-left">
            <th className="py-3 px-5 font-medium">Property</th>
            <th className="py-3 px-5 font-medium">City</th>
            <th className="py-3 px-5 font-medium text-right">Today's GTV</th>
            <th className="py-3 px-5 font-medium text-right">Compliance</th>
            <th className="py-3 px-5 font-medium text-center">Alerts</th>
            <th className="py-3 px-5 font-medium">Status</th>
            <th className="py-3 pl-2 pr-4"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr
              key={p.id}
              onClick={() => setActivePropertyId(p.id)}
              className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
            >
              <td className="py-2.5 px-5 font-medium text-navy-dark">{p.name}</td>
              <td className="py-2.5 px-5 text-slate2">{p.city}</td>
              <td className="py-2.5 px-5 text-right tabular-nums">{formatCNY(p.today_gtv)}</td>
              <td className="py-2.5 px-5 text-right tabular-nums">
                <span className={p.compliance_score >= 95 ? 'text-success' : p.compliance_score >= 85 ? 'text-warn' : 'text-danger'}>
                  {p.compliance_score}
                </span>
              </td>
              <td className="py-2.5 px-5 text-center">{openAlerts(p.id) || '—'}</td>
              <td className="py-2.5 px-5">
                <StatusBadge status={p.status} />
              </td>
              <td className="py-2.5 pl-2 pr-4 text-slate2"><ChevronRight size={14} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function StatusBadge({ status }: { status: typeof properties[number]['status'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    active:              { label: 'Active',              cls: 'bg-success/10 text-success' },
    reconciliation_gap:  { label: 'Reconciliation gap',  cls: 'bg-warn/15 text-warn' },
    compliance_issue:    { label: 'Compliance issue',    cls: 'bg-danger/10 text-danger' },
    offline:             { label: 'Offline',             cls: 'bg-slate-200 text-slate-600' },
  }
  const m = map[status]
  return <span className={`inline-block text-[10.5px] px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>
}

function PropertyDetail({ propertyId }: { propertyId: string }) {
  const property = properties.find(p => p.id === propertyId)!
  const trend = trend30d(property)
  const myAlerts = alerts.filter(a => a.property_id === propertyId)

  // Reuse the channel mix distribution per-property (scaled).
  const donutData = channelMix.map(c => ({
    name: c.name,
    value: Math.round(property.today_gtv * c.share),
    color: c.color,
  }))

  return (
    <div className="flex flex-col gap-5">
      {/* Header stats */}
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Property" value={property.name} sub={`${property.city} · ${property.brand}`} />
        <Stat label="Today's GTV"   value={formatCNY(property.today_gtv)} sub="Vs. 30-day avg: +4.2%" />
        <Stat label="This week"     value={formatCNY(property.today_gtv * 6.5)} sub="Projected close" />
        <Stat label="Compliance"    value={String(property.compliance_score)} sub={property.compliance_score >= 95 ? 'Above target' : 'Below target'} />
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <Card title="GTV — last 30 days" subtitle="Daily gross transaction volume">
            <div className="h-[240px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gtvFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#028090" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#028090" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCNY(v)} width={58} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(v) => [formatCNY(Number(v)), 'GTV']}
                  />
                  <Area type="monotone" dataKey="gtv" stroke="#028090" strokeWidth={2} fill="url(#gtvFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="col-span-4">
          <Card title="Channel Mix" subtitle="Today · this property">
            <div className="h-[240px] flex items-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={42} outerRadius={72} dataKey="value" stroke="none">
                    {donutData.map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCNY(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex flex-col gap-1.5 text-[11.5px] pl-1">
                {donutData.map(d => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-navy-dark">{d.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <Card title="Alerts" subtitle={`${myAlerts.length} item${myAlerts.length === 1 ? '' : 's'}`} noPadding>
            {myAlerts.length === 0 ? (
              <div className="p-5 text-[12.5px] text-slate2">No open alerts for this property.</div>
            ) : (
              <ul>
                {myAlerts.map(a => (
                  <li key={a.id} className="px-5 py-3 border-t border-slate-100 first:border-t-0">
                    <div className="text-[13px] font-medium text-navy-dark">{a.title}</div>
                    <div className="text-[11.5px] text-slate2">{a.body}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="col-span-5">
          <LiveFeed />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-card border border-slate-200/80 shadow-card p-4">
      <div className="text-[11px] uppercase tracking-[0.14em] text-slate2">{label}</div>
      <div className="font-serif text-[18px] text-navy-dark mt-1 leading-snug truncate">{value}</div>
      <div className="text-[11.5px] text-slate2 mt-1">{sub}</div>
    </div>
  )
}
