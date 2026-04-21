import { useMemo, useState } from 'react'
import Card from '../components/Card'
import { properties, regions, brands, alerts, type Property, type Region, type Brand } from '../data/mock'
import { useMode } from '../state/ModeContext'
import { formatCNY } from '../lib/format'

// Bounding box approx covering mainland China's populated coast & inland.
// lat: 18°N (Sanya) → 46°N (north);  lng: 97°E → 125°E
const LAT_MIN = 17, LAT_MAX = 46
const LNG_MIN = 96, LNG_MAX = 126

// Map canvas size in px (fills the card).
const W = 720, H = 440

function project(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * W
  // Invert y so north is up.
  const y = H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H
  return { x, y }
}

function pinColor(p: Property, platform: boolean, idx: number): string {
  if (!platform && idx % 5 < 2) return '#94A3B8' // gray — "no real-time data" in Current State
  if (p.status === 'compliance_issue')   return '#DC2626' // red
  if (p.status === 'reconciliation_gap') return '#F59E0B' // amber
  if (p.status === 'offline')            return '#94A3B8'
  return '#16A34A' // green
}

export default function MapView() {
  const { mode } = useMode()
  const platform = mode === 'platform'

  const [brand, setBrand] = useState<Brand | 'All'>('All')
  const [region, setRegion] = useState<Region | 'All'>('All')
  const [selected, setSelected] = useState<Property | null>(null)

  const shown = useMemo(
    () => properties.filter(p =>
      (brand === 'All' || p.brand === brand) &&
      (region === 'All' || p.region === region)
    ),
    [brand, region]
  )

  return (
    <div className="p-6 flex flex-col gap-5 min-h-full">
      <div>
        <h1 className="font-serif text-[26px] text-navy-dark tracking-tight">Portfolio Map</h1>
        <p className="text-[12.5px] text-slate2 mt-1">
          {platform ? 'Real-time property status across Greater China' : 'Status aggregated from weekly reports'}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 text-[12px]">
        <FilterSelect label="Brand"  value={brand}  options={['All', ...brands]}  onChange={v => setBrand(v as Brand | 'All')} />
        <FilterSelect label="Region" value={region} options={['All', ...regions]} onChange={v => setRegion(v as Region | 'All')} />
        <div className="flex-1" />
        <Legend platform={platform} />
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8">
          <Card noPadding>
            <div className="relative" style={{ height: H }}>
              {/* Abstract dotted grid as map background */}
              <HexDotGrid />

              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
                {/* Soft region blob behind pins */}
                <path
                  d={`M 140 340 Q 100 260 160 180 Q 260 60 440 80 Q 620 60 650 200 Q 680 320 560 380 Q 400 430 280 400 Q 190 380 140 340 Z`}
                  fill="rgba(14, 59, 67, 0.05)"
                  stroke="rgba(14, 59, 67, 0.15)"
                  strokeDasharray="4 6"
                  strokeWidth="1"
                />

                {shown.map((p, i) => {
                  const { x, y } = project(p.lat, p.lng)
                  const color = pinColor(p, platform, i)
                  return (
                    <g
                      key={p.id}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => setSelected(p)}
                      className="cursor-pointer"
                    >
                      {platform && color !== '#94A3B8' && (
                        <circle r="12" fill={color} opacity="0.25" className="animate-pulseDot" />
                      )}
                      <circle r="6" fill={color} stroke="white" strokeWidth="2" />
                    </g>
                  )
                })}
              </svg>
            </div>
          </Card>
        </div>

        <div className="col-span-4">
          {selected
            ? <PropertyPanel property={selected} onClose={() => setSelected(null)} />
            : (
              <Card title="Property detail" subtitle="Click a pin on the map">
                <div className="h-[340px] flex items-center justify-center text-[12px] text-slate2 text-center">
                  Select a property to see GTV, compliance status, top channels,<br />and open alerts.
                </div>
              </Card>
            )
          }
        </div>
      </div>
    </div>
  )
}

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-slate2">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-navy-dark"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Legend({ platform }: { platform: boolean }) {
  const items = platform
    ? [
        { c: '#16A34A', l: 'Active' },
        { c: '#F59E0B', l: 'Reconciliation gap' },
        { c: '#DC2626', l: 'Compliance issue' },
      ]
    : [
        { c: '#16A34A', l: 'Reporting' },
        { c: '#F59E0B', l: 'Lag' },
        { c: '#DC2626', l: 'Issue' },
        { c: '#94A3B8', l: 'No real-time data' },
      ]
  return (
    <div className="flex items-center gap-3">
      {items.map(i => (
        <div key={i.l} className="flex items-center gap-1.5 text-slate2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: i.c }} />
          {i.l}
        </div>
      ))}
    </div>
  )
}

function HexDotGrid() {
  // Pure CSS background — subtle dotted pattern evoking "territory".
  return (
    <div
      className="absolute inset-0 rounded-card"
      style={{
        backgroundImage: 'radial-gradient(rgba(14,59,67,0.10) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        backgroundPosition: '0 0',
      }}
    />
  )
}

function PropertyPanel({ property, onClose }: { property: Property; onClose: () => void }) {
  const propAlerts = alerts.filter(a => a.property_id === property.id)
  // Top 3 channels for this property (reuse global mix percentages).
  const topChannels = ['Alipay', 'WeChat Pay', 'UnionPay']
  return (
    <Card
      title={property.name}
      subtitle={`${property.city} · ${property.brand}`}
      right={<button onClick={onClose} className="text-slate2 text-[18px] leading-none">×</button>}
    >
      <div className="grid grid-cols-2 gap-3 mt-2 mb-4">
        <Mini label="Today's GTV"  value={formatCNY(property.today_gtv)} />
        <Mini label="Compliance"    value={String(property.compliance_score)} />
      </div>

      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 mb-1.5">Top channels</div>
        <div className="flex flex-wrap gap-1.5">
          {topChannels.map(c => (
            <span key={c} className="text-[11.5px] px-2 py-0.5 bg-slate-100 rounded-full text-navy-dark">{c}</span>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-slate2 mb-1.5">
          Open alerts ({propAlerts.length})
        </div>
        {propAlerts.length === 0 ? (
          <div className="text-[12px] text-slate2">None.</div>
        ) : (
          <ul className="flex flex-col gap-2">
            {propAlerts.map(a => (
              <li key={a.id} className="text-[12px]">
                <div className="font-medium text-navy-dark">{a.title}</div>
                <div className="text-slate2">{a.body}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-md p-2.5">
      <div className="text-[10.5px] uppercase tracking-wider text-slate2">{label}</div>
      <div className="font-serif text-[16px] text-navy-dark">{value}</div>
    </div>
  )
}
