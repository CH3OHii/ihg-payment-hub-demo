// Mock dataset for the IHG Greater China Payment Hub demo.
// All values are synthetic — used only for the live walkthrough.

export type Brand =
  | 'Regent'
  | 'InterContinental'
  | 'Kimpton'
  | 'Hotel Indigo'
  | 'voco'
  | 'Crowne Plaza'
  | 'EVEN Hotels'
  | 'Holiday Inn'
  | 'Holiday Inn Express'
  | 'HUALUXE'
  | 'Holiday Inn Resort'

export type Region = 'East' | 'North' | 'South' | 'Southwest' | 'Northwest' | 'Central'

export type PropertyStatus = 'active' | 'reconciliation_gap' | 'compliance_issue' | 'offline'

export interface Property {
  id: string
  name: string
  city: string
  region: Region
  brand: Brand
  lat: number           // latitude in decimal degrees
  lng: number           // longitude in decimal degrees
  compliance_score: number  // 0-100
  today_gtv: number     // CNY
  status: PropertyStatus
}

export const properties: Property[] = [
  { id: 'p01', name: 'InterContinental Shanghai Puxi',         city: 'Shanghai',  region: 'East',      brand: 'InterContinental', lat: 31.2304, lng: 121.4737, compliance_score: 98, today_gtv: 1_842_000, status: 'active' },
  { id: 'p02', name: 'Regent Shanghai on the Bund',             city: 'Shanghai',  region: 'East',      brand: 'Regent',           lat: 31.2396, lng: 121.4906, compliance_score: 97, today_gtv: 2_105_000, status: 'active' },
  { id: 'p03', name: 'Hotel Indigo Shanghai on the Bund',       city: 'Shanghai',  region: 'East',      brand: 'Hotel Indigo',     lat: 31.2351, lng: 121.4669, compliance_score: 96, today_gtv: 1_677_500, status: 'active' },
  { id: 'p04', name: 'InterContinental Beijing Sanlitun',       city: 'Beijing',   region: 'North',     brand: 'InterContinental', lat: 39.9359, lng: 116.4548, compliance_score: 99, today_gtv: 1_980_000, status: 'active' },
  { id: 'p05', name: 'Crowne Plaza Beijing Wangfujing',         city: 'Beijing',   region: 'North',     brand: 'Crowne Plaza',     lat: 39.9127, lng: 116.4108, compliance_score: 94, today_gtv: 1_120_000, status: 'active' },
  { id: 'p06', name: 'Holiday Inn Beijing Sanyuan',             city: 'Beijing',   region: 'North',     brand: 'Holiday Inn',      lat: 39.9680, lng: 116.4463, compliance_score: 92, today_gtv: 486_200,   status: 'active' },
  { id: 'p07', name: 'InterContinental Guangzhou Exhibition',   city: 'Guangzhou', region: 'South',     brand: 'InterContinental', lat: 23.1088, lng: 113.3195, compliance_score: 95, today_gtv: 1_540_000, status: 'active' },
  { id: 'p08', name: 'Holiday Inn Guangzhou Science City',      city: 'Guangzhou', region: 'South',     brand: 'Holiday Inn',      lat: 23.1814, lng: 113.4497, compliance_score: 88, today_gtv: 412_000,   status: 'reconciliation_gap' },
  { id: 'p09', name: 'Crowne Plaza Shenzhen Nanshan',           city: 'Shenzhen',  region: 'South',     brand: 'Crowne Plaza',     lat: 22.5384, lng: 113.9421, compliance_score: 93, today_gtv: 872_000,   status: 'active' },
  { id: 'p10', name: 'InterContinental Shenzhen Dameisha',      city: 'Shenzhen',  region: 'South',     brand: 'InterContinental', lat: 22.6183, lng: 114.3033, compliance_score: 97, today_gtv: 1_260_000, status: 'active' },
  { id: 'p11', name: 'Hotel Indigo Chengdu Downtown',           city: 'Chengdu',   region: 'Southwest', brand: 'Hotel Indigo',     lat: 30.6580, lng: 104.0654, compliance_score: 90, today_gtv: 522_000,   status: 'reconciliation_gap' },
  { id: 'p12', name: 'InterContinental Chengdu Global Center',  city: 'Chengdu',   region: 'Southwest', brand: 'InterContinental', lat: 30.5728, lng: 104.0668, compliance_score: 96, today_gtv: 1_104_000, status: 'active' },
  { id: 'p13', name: 'Crowne Plaza Hangzhou Xanadu',            city: 'Hangzhou',  region: 'East',      brand: 'Crowne Plaza',     lat: 30.2741, lng: 120.1551, compliance_score: 91, today_gtv: 690_500,   status: 'active' },
  { id: 'p14', name: 'InterContinental Hangzhou Liangzhu',      city: 'Hangzhou',  region: 'East',      brand: 'InterContinental', lat: 30.3861, lng: 120.0330, compliance_score: 78, today_gtv: 430_000,   status: 'compliance_issue' },
  { id: 'p15', name: 'HUALUXE Xi\u2019an High-Tech Zone',       city: 'Xi\u2019an',region: 'Northwest', brand: 'HUALUXE',          lat: 34.2219, lng: 108.9598, compliance_score: 86, today_gtv: 298_000,   status: 'active' },
  { id: 'p16', name: 'Crowne Plaza Wuhan Optics Valley',        city: 'Wuhan',     region: 'Central',   brand: 'Crowne Plaza',     lat: 30.5145, lng: 114.4266, compliance_score: 89, today_gtv: 512_000,   status: 'active' },
  { id: 'p17', name: 'Kimpton Qiantan Shanghai',                city: 'Shanghai',  region: 'East',      brand: 'Kimpton',          lat: 31.1717, lng: 121.5301, compliance_score: 95, today_gtv: 740_000,   status: 'active' },
  { id: 'p18', name: 'voco Nanjing Xinjiekou',                  city: 'Nanjing',   region: 'East',      brand: 'voco',             lat: 32.0415, lng: 118.7781, compliance_score: 93, today_gtv: 385_500,   status: 'active' },
  { id: 'p19', name: 'Holiday Inn Express Kunming Downtown',    city: 'Kunming',   region: 'Southwest', brand: 'Holiday Inn Express', lat: 25.0389, lng: 102.7183, compliance_score: 84, today_gtv: 196_000, status: 'reconciliation_gap' },
  { id: 'p20', name: 'Holiday Inn Resort Sanya Bay',            city: 'Sanya',     region: 'South',     brand: 'Holiday Inn Resort', lat: 18.2528, lng: 109.5119, compliance_score: 87, today_gtv: 328_000, status: 'active' },
]

export const regions: Region[] = ['East', 'North', 'South', 'Southwest', 'Northwest', 'Central']
export const brands: Brand[] = ['Regent', 'InterContinental', 'Kimpton', 'Hotel Indigo', 'voco', 'Crowne Plaza', 'EVEN Hotels', 'Holiday Inn', 'Holiday Inn Express', 'HUALUXE', 'Holiday Inn Resort']

// ─────────────────────────────────────────────────────────────
// Channels & market mix

export type Channel = 'Alipay' | 'WeChat Pay' | 'UnionPay' | 'Visa/MC' | 'Other'

export interface ChannelRow {
  name: Channel
  share: number   // 0-1
  amount: number  // CNY today
  color: string
}

export const channelMix: ChannelRow[] = [
  { name: 'Alipay',     share: 0.38, amount: 813_200_000, color: '#00A896' }, // mint
  { name: 'WeChat Pay', share: 0.29, amount: 620_600_000, color: '#028090' }, // teal
  { name: 'UnionPay',   share: 0.19, amount: 406_600_000, color: '#C9A961' }, // gold
  { name: 'Visa/MC',    share: 0.09, amount: 192_600_000, color: '#64748B' }, // slate
  { name: 'Other',      share: 0.05, amount: 107_000_000, color: '#94A3B8' }, // light slate
]

// ─────────────────────────────────────────────────────────────
// Alerts

export type Severity = 'red' | 'amber' | 'green'

export interface Alert {
  id: string
  severity: Severity
  title: string
  body: string
  property_id: string
  recommended_action: string
}

export const alerts: Alert[] = [
  { id: 'a1',  severity: 'red',   title: 'Shanghai Pudong JV #12',        body: 'PCI certificate expires in 5 days',                   property_id: 'p01', recommended_action: 'Rotate merchant-gateway PCI credentials before 2026-04-26.' },
  { id: 'a2',  severity: 'red',   title: 'InterContinental Hangzhou Liangzhu', body: 'Compliance score dropped below threshold (78)',   property_id: 'p14', recommended_action: 'Assign compliance officer and request remediation plan.' },
  { id: 'a3',  severity: 'amber', title: 'Holiday Inn Guangzhou Science City', body: 'Ctrip VCC reconciliation lag: 8 days',             property_id: 'p08', recommended_action: 'Push manual match workflow to Ctrip operations.' },
  { id: 'a4',  severity: 'amber', title: 'Hotel Indigo Chengdu Downtown', body: 'Fliggy VCC mismatch volume up 18% WoW',                property_id: 'p11', recommended_action: 'Review Fliggy rate plan mapping for duplicates.' },
  { id: 'a5',  severity: 'amber', title: 'Holiday Inn Express Kunming',   body: 'Missing end-of-day batch (last 2 days)',              property_id: 'p19', recommended_action: 'Ping property finance lead; verify POS batch export.' },
  { id: 'a6',  severity: 'green', title: 'Crowne Plaza Beijing Wangfujing', body: 'Remediation complete — now above target',            property_id: 'p05', recommended_action: 'No action required. Close ticket.' },
  { id: 'a7',  severity: 'red',   title: 'Holiday Inn Xi\u2019an',         body: 'Currency cut-off ledger anomaly detected',           property_id: 'p15', recommended_action: 'Engage treasury to reconcile CNY/USD cut-off.' },
  { id: 'a8',  severity: 'amber', title: 'voco Nanjing Xinjiekou',        body: 'Refund-to-capture ratio: 4.2% (target < 3%)',         property_id: 'p18', recommended_action: 'Share benchmark with GM; review refund policy exceptions.' },
  { id: 'a9',  severity: 'amber', title: 'Crowne Plaza Wuhan Optics Valley', body: 'Outage detected on UnionPay rail (22m)',           property_id: 'p16', recommended_action: 'Monitor rail; failover should have auto-routed.' },
  { id: 'a10', severity: 'green', title: 'InterContinental Beijing Sanlitun', body: 'Channel mix health: all 5 rails green',           property_id: 'p04', recommended_action: 'No action required.' },
  { id: 'a11', severity: 'red',   title: 'EVEN Hotels Sanya Yalong Bay',  body: 'KYC refresh overdue for primary contact',             property_id: 'p20', recommended_action: 'Require compliance officer to re-verify KYC documents.' },
  { id: 'a12', severity: 'amber', title: 'Kimpton Qiantan Shanghai',      body: 'OTA booking lag 3.1 days vs. 1.5 day target',         property_id: 'p17', recommended_action: 'Open case with Booking.com integration team.' },
]

// ─────────────────────────────────────────────────────────────
// OTA VCC queue — the reconciliation pain

export type OTASource = 'Ctrip' | 'Fliggy' | 'Booking' | 'Agoda'

export interface VCCItem {
  id: string
  date: string       // YYYY-MM-DD
  ota: OTASource
  property_id: string
  amount: number     // CNY
  // In "Current State" most items are 'manual'; in "Platform" mode ~94% become 'auto'.
  status_current: 'manual' | 'auto' | 'flagged'
  status_platform: 'manual' | 'auto' | 'flagged'
}

function daysAgo(n: number): string {
  const d = new Date(2026, 3, 21) // April is month 3 (0-indexed) — 2026-04-21
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// Build 50 VCC items deterministically
export const vccQueue: VCCItem[] = (() => {
  const otas: OTASource[] = ['Ctrip', 'Fliggy', 'Booking', 'Agoda']
  const items: VCCItem[] = []
  for (let i = 0; i < 50; i++) {
    const prop = properties[i % properties.length]
    const ota = otas[i % otas.length]
    const amount = 1800 + ((i * 997) % 14_200)
    const d = daysAgo((i % 14) + 1)
    // In platform mode, flag 3 items (i.e. 94% auto-matched)
    const flaggedIdx = i === 7 || i === 23 || i === 41
    items.push({
      id: `vcc-${i + 1}`,
      date: d,
      ota,
      property_id: prop.id,
      amount,
      status_current: 'manual',
      status_platform: flaggedIdx ? 'flagged' : 'auto',
    })
  }
  return items
})()

// ─────────────────────────────────────────────────────────────
// Transaction generator

export interface Txn {
  id: number
  ts: string     // HH:MM:SS
  property: Property
  amount: number
  channel: Channel
  success: boolean
}

// Property weight ≈ today's GTV — larger properties pump more txns
const propWeights = properties.map(p => p.today_gtv)
const propWeightSum = propWeights.reduce((a, b) => a + b, 0)

// Channel weight = market share
const channelWeights = channelMix.map(c => c.share)

let txnCounter = 0

function weightedPick<T>(items: T[], weights: number[], total: number): T {
  let r = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    r -= weights[i]
    if (r <= 0) return items[i]
  }
  return items[items.length - 1]
}

function formatHMS(d: Date): string {
  return d.toTimeString().slice(0, 8)
}

export function generateTxn(now: Date = new Date()): Txn {
  const property = weightedPick(properties, propWeights, propWeightSum)
  const channel = weightedPick(channelMix.map(c => c.name), channelWeights, 1)
  // Amount: small room-service charges (~¥80) to banquet block (~¥25k)
  const band = Math.random()
  let amount: number
  if      (band < 0.55) amount = Math.round(40  + Math.random() * 900)    // quick charges
  else if (band < 0.85) amount = Math.round(900 + Math.random() * 4_100)  // room nights
  else if (band < 0.97) amount = Math.round(5_000 + Math.random() * 8_000) // suites
  else                  amount = Math.round(12_000 + Math.random() * 18_000) // events
  const success = Math.random() > 0.01 // 99% success
  return {
    id: ++txnCounter,
    ts: formatHMS(now),
    property,
    amount,
    channel,
    success,
  }
}

// Seed the feed with 12 recent transactions so we render something on first paint.
export function seedTxnFeed(size = 12): Txn[] {
  const out: Txn[] = []
  const base = new Date()
  for (let i = 0; i < size; i++) {
    const t = new Date(base.getTime() - i * 3_200)
    out.push(generateTxn(t))
  }
  return out
}

// ─────────────────────────────────────────────────────────────
// Per-property 30-day GTV trend (used on drill-down)

export function trend30d(property: Property): { day: string; gtv: number }[] {
  const out: { day: string; gtv: number }[] = []
  const base = property.today_gtv
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    // Deterministic wobble — seed from id char codes
    const seed = property.id.charCodeAt(1) + i
    const wobble = (Math.sin(seed * 0.9) + Math.cos(seed * 0.37)) * 0.18
    const weekend = (d.getDay() === 5 || d.getDay() === 6) ? 0.15 : 0
    const val = Math.round(base * (0.78 + wobble * 0.5 + weekend))
    out.push({ day: d.toISOString().slice(5, 10), gtv: val })
  }
  return out
}

// ─────────────────────────────────────────────────────────────
// Summary KPIs — vary by mode. "Current" numbers look stale; "Platform" numbers feel alive.

export interface KPISnapshot {
  gtv: number                 // CNY today
  propertiesReporting: number // N / 623
  propertiesTotal: number
  complianceRate: number      // 0-100 (%)
  pendingReconciliation: number // CNY
  updatedAgoSeconds: number | 'stale'
}

export const kpiCurrent: KPISnapshot = {
  gtv: 2_140_000_000,
  propertiesReporting: 387,
  propertiesTotal: 623,
  complianceRate: 91.2,
  pendingReconciliation: 87_000_000,
  updatedAgoSeconds: 'stale',
}

export const kpiPlatform: KPISnapshot = {
  gtv: 2_140_000_000,
  propertiesReporting: 612,
  propertiesTotal: 623,
  complianceRate: 99.3,
  pendingReconciliation: 5_200_000,
  updatedAgoSeconds: 0.4,
}
