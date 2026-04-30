// Mock dataset for the Franchisee dashboard.
// All values are deterministic per-property — derived from property id + mode.
// Imports from mock.ts; does not modify HQ data.

import { properties, vccQueue } from './mock'
import type { Property } from './mock'
import type { Mode } from '../state/ModeContext'

// ─────────────────────────────────────────────────────────────
// Demo date anchor — matches mock.ts (2026-04-21)
const DEMO_TODAY = new Date(2026, 3, 21)

function daysFromToday(n: number): string {
  const d = new Date(DEMO_TODAY)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function monthFromToday(n: number): string {
  const d = new Date(DEMO_TODAY)
  d.setMonth(d.getMonth() + n)
  return d.toISOString().slice(0, 7)
}

// ─────────────────────────────────────────────────────────────
// Deterministic seed + PRNG so values are stable per propertyId

function seedFromId(id: string): number {
  let h = 7
  for (let i = 0; i < id.length; i++) {
    h = ((h << 5) - h + id.charCodeAt(i)) >>> 0
  }
  return h
}

function makeRand(seed: number): () => number {
  let x = seed >>> 0
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0
    return x / 0xffffffff
  }
}

function getProperty(id: string): Property {
  const p = properties.find(x => x.id === id)
  if (!p) throw new Error(`Property not found: ${id}`)
  return p
}

// ─────────────────────────────────────────────────────────────
// Brand ADR baseline (CNY) — used to derive RevPAR + per-stay revenue

function brandAdr(brand: Property['brand']): number {
  const map: Record<Property['brand'], number> = {
    Regent: 3200,
    InterContinental: 2200,
    Kimpton: 1900,
    'Hotel Indigo': 1700,
    voco: 1300,
    'Crowne Plaza': 1200,
    'EVEN Hotels': 1000,
    HUALUXE: 1400,
    'Holiday Inn': 850,
    'Holiday Inn Express': 580,
    'Holiday Inn Resort': 1500,
  }
  return map[brand] ?? 900
}

// Tier-1 cities have more international guests → more Visa/MC/JCB
function isTier1(city: string): boolean {
  return ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'].includes(city)
}

// ─────────────────────────────────────────────────────────────
// Types

export interface FranchiseeKPIs {
  todayGTV: number
  adr: number
  adr30dAvg: number
  revpar: number
  revpar30dAvg: number
  occupancy: number       // 0–1
  occupancy30dAvg: number
  cashSettled: number
  cashPending: number
  cashHeldByOTA: number
}

export type SettlementChannel =
  | 'Alipay'
  | 'WeChat Pay'
  | 'UnionPay'
  | 'Visa/MC'
  | 'JCB'
  | 'Ctrip VCC'
  | 'Fliggy VCC'
  | 'Booking VCC'

export interface SettlementRow {
  channel: SettlementChannel
  pendingAmount: number
  tplus: number
  settlesOn: string
  fxRate?: number
  onTime: boolean
  note?: string
}

export interface AgingBucket {
  range: '0-7d' | '8-14d' | '15-30d' | '30+d'
  amount: number
}

export interface FeeBreakdown {
  month: string
  base: number
  marketing: number
  techCrs: number
  loyalty: number
  total: number
  roomRevenue: number
  fxRateUsed: number
  fxMidRate: number
}

export interface PerStayFee {
  stayId: string
  date: string
  guestType: 'direct' | 'OTA' | 'corporate' | 'walk-in'
  channel: string
  roomRevenue: number
  base: number
  marketing: number
  techCrs: number
  loyalty: number
  total: number
}

export type FranchiseeChannel =
  | 'IHG.com'
  | 'IHG One Rewards app'
  | 'Ctrip'
  | 'Fliggy'
  | 'Meituan'
  | 'Booking.com'
  | 'Walk-in'

export interface ChannelMargin {
  channel: FranchiseeChannel
  bookings: number
  revenue: number
  commissionPct: number
  commissionAmt: number
  net: number
  marginTier: 'high' | 'mid' | 'low'
}

export interface DisputeRow {
  id: string
  date: string
  amount: number
  reason: string
  status: 'open' | 'resolved'
}

export interface DualFileMatchSnapshot {
  merchantLines: number
  weChatSettlementLines: number
  matched: number
  unmatched: number
  autoMatchPct: number
  lastSyncLabel: string
  reviewerNote: string
}

export interface ComplianceStatus {
  fapiaoEligible: boolean
  fapiaoIssuedToday: number
  fapiaoBatchSize: number
  fapiaoBatchDate: string
  pbocCutoffMet: boolean
  dataLocalizationOK: boolean
  pciCertExpiresInDays: number
  overallTone: 'green' | 'amber'
}

export interface FranchiseePaymentChannel {
  name: 'Alipay' | 'WeChat Pay' | 'UnionPay' | 'Visa/MC' | 'JCB' | 'Cash'
  share: number
  amount: number
  color: string
}

// ─────────────────────────────────────────────────────────────
// KPIs

export function franchiseeKPIs(propId: string, mode: Mode): FranchiseeKPIs {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed)
  const adr = Math.round(brandAdr(p.brand) * (0.92 + rng() * 0.16))
  const occupancy = 0.62 + rng() * 0.22
  const revpar = Math.round(adr * occupancy)
  const adr30 = Math.round(adr * (0.96 + rng() * 0.06))
  const revpar30 = Math.round(adr30 * (occupancy * (0.96 + rng() * 0.05)))
  const occ30 = +(occupancy * (0.96 + rng() * 0.05)).toFixed(3)

  // Cash position depends on mode: in current, less is settled, more is held
  const settledShare = mode === 'platform' ? 0.68 : 0.42
  const otaHoldDays = mode === 'platform' ? 8 : 18
  const cashSettled = Math.round(p.today_gtv * settledShare * 8) // ~8 days of operating cash settled
  const cashPending = Math.round(p.today_gtv * (mode === 'platform' ? 0.18 : 0.34) * 4)
  const cashHeldByOTA = Math.round(p.today_gtv * 0.22 * otaHoldDays * 0.1)

  return {
    todayGTV: p.today_gtv,
    adr,
    adr30dAvg: adr30,
    revpar,
    revpar30dAvg: revpar30,
    occupancy,
    occupancy30dAvg: occ30,
    cashSettled,
    cashPending,
    cashHeldByOTA,
  }
}

// ─────────────────────────────────────────────────────────────
// Per-property payment channel mix (Overview donut)

export function paymentChannelsFor(propId: string): FranchiseePaymentChannel[] {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed)
  const intl = isTier1(p.city) ? 0.18 : 0.05
  const cash = 0.04 + rng() * 0.04
  const alipay = 0.34 + rng() * 0.06
  const wechat = 0.26 + rng() * 0.06
  // remaining for unionpay + intl
  const remaining = 1 - alipay - wechat - cash - intl
  const unionpay = remaining * 0.7
  const visa = intl * 0.7
  const jcb = intl * 0.3 + remaining * 0.3
  const total = p.today_gtv

  const rows: FranchiseePaymentChannel[] = [
    { name: 'Alipay', share: alipay, amount: Math.round(total * alipay), color: '#00A896' },
    { name: 'WeChat Pay', share: wechat, amount: Math.round(total * wechat), color: '#028090' },
    { name: 'UnionPay', share: unionpay, amount: Math.round(total * unionpay), color: '#C9A961' },
    { name: 'Visa/MC', share: visa, amount: Math.round(total * visa), color: '#64748B' },
    { name: 'JCB', share: jcb, amount: Math.round(total * jcb), color: '#8B6E1F' },
    { name: 'Cash', share: cash, amount: Math.round(total * cash), color: '#94A3B8' },
  ]
  // Normalize to sum to 1 (rounding fixup)
  const sum = rows.reduce((a, r) => a + r.share, 0)
  return rows.map(r => ({ ...r, share: r.share / sum }))
}

// ─────────────────────────────────────────────────────────────
// Settlements

export function settlementsFor(propId: string, mode: Mode): SettlementRow[] {
  const channels = paymentChannelsFor(propId)
  const findShare = (name: string) => channels.find(c => c.name === name)?.share ?? 0
  const p = getProperty(propId)
  const dailyGTV = p.today_gtv

  // Pending = ~3 days of receipts in pipe (less in platform mode)
  const pipeDays = mode === 'platform' ? 1.6 : 3.2

  const fxRate = mode === 'platform' ? 7.184 : 7.221  // worse rate in current
  const midRate = 7.179

  const rows: SettlementRow[] = [
    {
      channel: 'Alipay',
      pendingAmount: Math.round(dailyGTV * findShare('Alipay') * pipeDays),
      tplus: mode === 'platform' ? 1 : 2,
      settlesOn: daysFromToday(mode === 'platform' ? 1 : 2),
      onTime: mode === 'platform',
      note: mode === 'platform' ? 'Auto-cleared' : 'Manual confirm pending',
    },
    {
      channel: 'WeChat Pay',
      pendingAmount: Math.round(dailyGTV * findShare('WeChat Pay') * pipeDays),
      tplus: mode === 'platform' ? 1 : 3,
      settlesOn: daysFromToday(mode === 'platform' ? 1 : 3),
      onTime: mode === 'platform',
      note: mode === 'platform' ? 'Dual-file matched' : 'Awaiting dual-file recon',
    },
    {
      channel: 'UnionPay',
      pendingAmount: Math.round(dailyGTV * findShare('UnionPay') * pipeDays),
      tplus: 1,
      settlesOn: daysFromToday(1),
      onTime: true,
    },
    {
      channel: 'Visa/MC',
      pendingAmount: Math.round(dailyGTV * findShare('Visa/MC') * pipeDays * 1.4),
      tplus: 2,
      settlesOn: daysFromToday(2),
      fxRate,
      onTime: mode === 'platform',
      note: mode === 'platform'
        ? `FX locked at ${fxRate} (mid ${midRate}, spread 0.07%)`
        : `FX rate not disclosed · estimate ${fxRate}`,
    },
    {
      channel: 'JCB',
      pendingAmount: Math.round(dailyGTV * findShare('JCB') * pipeDays * 1.4),
      tplus: 2,
      settlesOn: daysFromToday(2),
      fxRate: mode === 'platform' ? 7.181 : 7.226,
      onTime: mode === 'platform',
    },
    {
      channel: 'Ctrip VCC',
      pendingAmount: Math.round(dailyGTV * 0.18 * (mode === 'platform' ? 6 : 14)),
      tplus: mode === 'platform' ? 5 : 15,
      settlesOn: daysFromToday(mode === 'platform' ? 5 : 15),
      onTime: mode === 'platform',
      note: mode === 'platform' ? 'Auto-matched' : 'T+15 lag · 8 unmatched',
    },
    {
      channel: 'Fliggy VCC',
      pendingAmount: Math.round(dailyGTV * 0.06 * (mode === 'platform' ? 7 : 18)),
      tplus: mode === 'platform' ? 7 : 18,
      settlesOn: daysFromToday(mode === 'platform' ? 7 : 18),
      onTime: mode === 'platform',
      note: mode === 'platform' ? 'Auto-matched' : 'Rate plan mismatch',
    },
    {
      channel: 'Booking VCC',
      pendingAmount: Math.round(dailyGTV * 0.04 * (mode === 'platform' ? 9 : 22)),
      tplus: mode === 'platform' ? 9 : 22,
      settlesOn: daysFromToday(mode === 'platform' ? 9 : 22),
      onTime: mode === 'platform',
    },
  ]
  return rows
}

// ─────────────────────────────────────────────────────────────
// Aging buckets (for receivables)

export function agingFor(propId: string, mode: Mode): AgingBucket[] {
  const p = getProperty(propId)
  const total = p.today_gtv * 12 // ~12 days of receivables in pipe

  const split = mode === 'platform'
    ? [0.74, 0.18, 0.06, 0.02]
    : [0.42, 0.28, 0.20, 0.10]

  return [
    { range: '0-7d', amount: Math.round(total * split[0]) },
    { range: '8-14d', amount: Math.round(total * split[1]) },
    { range: '15-30d', amount: Math.round(total * split[2]) },
    { range: '30+d', amount: Math.round(total * split[3]) },
  ]
}

// ─────────────────────────────────────────────────────────────
// WeChat dual-file match snapshot

export function dualFileMatchFor(propId: string, mode: Mode): DualFileMatchSnapshot {
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 11)
  const merchantLines = Math.round(140 + rng() * 80)
  const wcLines = merchantLines + (mode === 'platform' ? 2 : 23)
  const matched = mode === 'platform' ? merchantLines - 2 : merchantLines - 23
  const unmatched = wcLines - matched
  const autoMatchPct = mode === 'platform' ? 99.1 : 0
  return {
    merchantLines,
    weChatSettlementLines: wcLines,
    matched,
    unmatched,
    autoMatchPct,
    lastSyncLabel: mode === 'platform' ? '0.4s ago' : '2 days ago',
    reviewerNote: mode === 'platform'
      ? '2 exceptions in queue · auto-flagged for review'
      : 'Manual review required · staff time ~3hr/day',
  }
}

// ─────────────────────────────────────────────────────────────
// Fees: 12-month YTD breakdown + this month

const FX_HISTORY = [
  7.179, 7.182, 7.180, 7.184, 7.187, 7.181, 7.176, 7.183, 7.190, 7.185, 7.182, 7.184,
]

export function feesYTD(propId: string): FeeBreakdown[] {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 23)
  const out: FeeBreakdown[] = []
  // Last 12 full months (oldest first)
  for (let i = 11; i >= 0; i--) {
    const month = monthFromToday(-i)
    const monthlyRoomRev = Math.round(p.today_gtv * 30 * 0.6 * (0.85 + rng() * 0.32))
    const base = Math.round(monthlyRoomRev * 0.05)
    const marketing = Math.round(monthlyRoomRev * 0.03)
    const techCrs = Math.round(monthlyRoomRev * 0.015)
    const loyalty = Math.round(monthlyRoomRev * 0.02)
    const total = base + marketing + techCrs + loyalty
    out.push({
      month,
      base,
      marketing,
      techCrs,
      loyalty,
      total,
      roomRevenue: monthlyRoomRev,
      fxRateUsed: FX_HISTORY[11 - i],
      fxMidRate: 7.179,
    })
  }
  return out
}

export function feesThisMonth(propId: string): FeeBreakdown {
  const all = feesYTD(propId)
  return all[all.length - 1]
}

// ─────────────────────────────────────────────────────────────
// Per-stay fees

const GUEST_TYPES: PerStayFee['guestType'][] = ['direct', 'OTA', 'corporate', 'walk-in']
const GUEST_WEIGHTS = [0.40, 0.35, 0.15, 0.10]
const CHANNEL_BY_GUEST: Record<PerStayFee['guestType'], string[]> = {
  direct: ['IHG.com', 'IHG One Rewards app'],
  OTA: ['Ctrip', 'Fliggy', 'Meituan', 'Booking.com'],
  corporate: ['Corporate'],
  'walk-in': ['Walk-in'],
}

function pickWeighted<T>(items: T[], weights: number[], r: number): T {
  let acc = 0
  for (let i = 0; i < items.length; i++) {
    acc += weights[i]
    if (r <= acc) return items[i]
  }
  return items[items.length - 1]
}

export function perStayFees(propId: string, n = 20): PerStayFee[] {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 41)
  const baseAdr = brandAdr(p.brand)
  const out: PerStayFee[] = []
  for (let i = 0; i < n; i++) {
    const dayOffset = -Math.floor(rng() * 7)
    const date = daysFromToday(dayOffset)
    const guestType = pickWeighted(GUEST_TYPES, GUEST_WEIGHTS, rng())
    const channels = CHANNEL_BY_GUEST[guestType]
    const channel = channels[Math.floor(rng() * channels.length)]
    const nights = 1 + Math.floor(rng() * 3)
    const roomRevenue = Math.round(baseAdr * nights * (0.88 + rng() * 0.24))
    const base = Math.round(roomRevenue * 0.05)
    const marketing = Math.round(roomRevenue * 0.03)
    const techCrs = Math.round(roomRevenue * 0.015)
    const loyalty = Math.round(roomRevenue * (guestType === 'direct' ? 0.025 : 0.015))
    const total = base + marketing + techCrs + loyalty
    out.push({
      stayId: `S-${propId}-${(seed + i).toString(36).slice(-5).toUpperCase()}`,
      date,
      guestType,
      channel,
      roomRevenue,
      base,
      marketing,
      techCrs,
      loyalty,
      total,
    })
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ─────────────────────────────────────────────────────────────
// Channel margins

const CHANNEL_COMMISSION: Record<FranchiseeChannel, number> = {
  'IHG.com': 0,
  'IHG One Rewards app': 0,
  Ctrip: 0.045,
  Fliggy: 0.13,
  Meituan: 0.12,
  'Booking.com': 0.15,
  'Walk-in': 0,
}

const CHANNEL_BOOKING_SHARE: Record<FranchiseeChannel, number> = {
  'IHG.com': 0.16,
  'IHG One Rewards app': 0.12,
  Ctrip: 0.28,
  Fliggy: 0.10,
  Meituan: 0.14,
  'Booking.com': 0.06,
  'Walk-in': 0.14,
}

export function channelMarginsFor(propId: string, mode: Mode): ChannelMargin[] {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 67)
  // Estimate monthly revenue from today_gtv
  const monthlyRevenue = p.today_gtv * 30 * 0.7

  const out: ChannelMargin[] = []
  for (const channel of Object.keys(CHANNEL_BOOKING_SHARE) as FranchiseeChannel[]) {
    let share = CHANNEL_BOOKING_SHARE[channel]
    // Platform mode nudges direct channels up, OTAs down (telling the loyalty story)
    if (mode === 'platform') {
      if (channel === 'IHG.com' || channel === 'IHG One Rewards app') share *= 1.18
      else if (channel === 'Ctrip' || channel === 'Meituan' || channel === 'Fliggy' || channel === 'Booking.com') share *= 0.9
    }
    const variance = 0.92 + rng() * 0.18
    const revenue = Math.round(monthlyRevenue * share * variance)
    const bookings = Math.round(revenue / (brandAdr(p.brand) * 1.5))
    const commissionPct = CHANNEL_COMMISSION[channel]
    const commissionAmt = Math.round(revenue * commissionPct)
    const net = revenue - commissionAmt
    const tier: ChannelMargin['marginTier'] =
      commissionPct === 0 ? 'high' : commissionPct < 0.08 ? 'mid' : 'low'
    out.push({
      channel,
      bookings,
      revenue,
      commissionPct,
      commissionAmt,
      net,
      marginTier: tier,
    })
  }
  return out.sort((a, b) => b.net - a.net)
}

export function channelTrend30d(propId: string): { day: string; direct: number; ctrip: number; meituan: number; fliggy: number; booking: number; walkIn: number }[] {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 89)
  const out = []
  for (let i = 29; i >= 0; i--) {
    const day = daysFromToday(-i).slice(5)
    const dailyRevenue = p.today_gtv * 0.7 * (0.75 + rng() * 0.40)
    const isWeekend = (() => {
      const d = new Date(DEMO_TODAY)
      d.setDate(d.getDate() - i)
      return d.getDay() === 5 || d.getDay() === 6
    })()
    const wkn = isWeekend ? 1.18 : 1
    out.push({
      day,
      direct: Math.round(dailyRevenue * 0.28 * wkn),
      ctrip: Math.round(dailyRevenue * 0.28 * wkn),
      meituan: Math.round(dailyRevenue * 0.14 * wkn),
      fliggy: Math.round(dailyRevenue * 0.10 * wkn),
      booking: Math.round(dailyRevenue * 0.06 * wkn),
      walkIn: Math.round(dailyRevenue * 0.14 * wkn),
    })
  }
  return out
}

// Loyalty member-night contribution (single number for a KPI tile)
export function loyaltyMemberShare(propId: string, mode: Mode): number {
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 101)
  const base = 0.34 + rng() * 0.10
  return mode === 'platform' ? Math.min(0.62, base + 0.08) : base
}

// ─────────────────────────────────────────────────────────────
// Disputes

const DISPUTE_REASONS = [
  'FX rate disclosed differs from PBOC mid by 0.18%',
  'Loyalty fee allocation for member stays unclear',
  'Tech & CRS fee tier change not pre-notified',
  'Marketing fund spend report unavailable',
  'Per-stay base royalty mismatch with PMS folio',
]

export function disputesFor(propId: string, mode: Mode): DisputeRow[] {
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 113)
  const out: DisputeRow[] = []

  // Resolved historical (always show 2)
  for (let i = 0; i < 2; i++) {
    out.push({
      id: `D-${propId}-${(seed + i).toString(36).slice(-4).toUpperCase()}`,
      date: daysFromToday(-30 - Math.floor(rng() * 60)),
      amount: Math.round(8000 + rng() * 24000),
      reason: DISPUTE_REASONS[Math.floor(rng() * DISPUTE_REASONS.length)],
      status: 'resolved',
    })
  }

  // Open: 3 in current, 0 in platform
  if (mode === 'current') {
    for (let i = 0; i < 3; i++) {
      out.push({
        id: `D-${propId}-${(seed + 100 + i).toString(36).slice(-4).toUpperCase()}`,
        date: daysFromToday(-Math.floor(rng() * 14)),
        amount: Math.round(5000 + rng() * 30000),
        reason: DISPUTE_REASONS[Math.floor(rng() * DISPUTE_REASONS.length)],
        status: 'open',
      })
    }
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : -1))
}

// ─────────────────────────────────────────────────────────────
// Compliance status

export function complianceFor(propId: string, mode: Mode): ComplianceStatus {
  const p = getProperty(propId)
  const seed = seedFromId(propId)
  const rng = makeRand(seed + 137)
  // ¥5M turnover threshold for special VAT — most properties qualify
  const monthlyTurnover = p.today_gtv * 30
  const fapiaoEligible = monthlyTurnover > 5_000_000
  const batchSize = Math.round(38 + rng() * 14)
  const issued = mode === 'platform' ? batchSize : 0  // all issued in platform; pending in current
  const batchDate = mode === 'platform' ? daysFromToday(0) : daysFromToday(-3)
  const pciDays = mode === 'platform' ? 60 + Math.floor(rng() * 80) : 12

  return {
    fapiaoEligible,
    fapiaoIssuedToday: issued,
    fapiaoBatchSize: batchSize,
    fapiaoBatchDate: batchDate,
    pbocCutoffMet: mode === 'platform',
    dataLocalizationOK: true,
    pciCertExpiresInDays: pciDays,
    overallTone: mode === 'platform' ? 'green' : 'amber',
  }
}

// ─────────────────────────────────────────────────────────────
// VCC items filtered to a single property (reuses HQ vccQueue)

export function vccItemsFor(propId: string) {
  return vccQueue.filter(v => v.property_id === propId)
}

// ─────────────────────────────────────────────────────────────
// Property alerts filtered to a single property — shapes match HQ alert
// but we synthesize 2-4 franchisee-specific alerts so the demo isn't empty

export interface FranchiseeAlert {
  id: string
  severity: 'red' | 'amber' | 'green'
  title: string
  body: string
  property_id: string
  recommended_action: string
}

const FRANCHISEE_ALERT_TEMPLATES: { severity: 'red' | 'amber' | 'green'; title: string; body: string; recommended_action: string }[] = [
  {
    severity: 'amber',
    title: 'WeChat dual-file mismatch',
    body: '23 unmatched lines in yesterday\'s WeChat settlement file.',
    recommended_action: 'Run dual-file reconciliation; flag exceptions to finance.',
  },
  {
    severity: 'amber',
    title: 'Ctrip VCC lag',
    body: 'T+15 settlement window is at risk for 8 bookings.',
    recommended_action: 'Push manual match workflow to Ctrip ops by EOD.',
  },
  {
    severity: 'red',
    title: 'FX spread above target',
    body: 'USD remittance rate spread vs. PBOC mid: 0.32% (target <0.10%).',
    recommended_action: 'Open ticket with treasury; request re-quote.',
  },
  {
    severity: 'green',
    title: 'Fapiao batch issued',
    body: 'Special VAT fapiao batch (47 invoices) cleared at 14:02.',
    recommended_action: 'No action required.',
  },
]

const PLATFORM_ALERT_TEMPLATES: typeof FRANCHISEE_ALERT_TEMPLATES = [
  {
    severity: 'green',
    title: 'WeChat dual-file matched',
    body: 'Auto-matched 99.1% · 2 exceptions in queue.',
    recommended_action: 'Review 2 exceptions in Settlements view.',
  },
  {
    severity: 'green',
    title: 'Fapiao batch issued',
    body: 'Special VAT fapiao batch (47/47) cleared at 14:02 today.',
    recommended_action: 'No action required.',
  },
  {
    severity: 'green',
    title: 'PBOC cutoff cleared',
    body: 'All merchant fund transfers landed within the 24h window.',
    recommended_action: 'No action required.',
  },
]

export function alertsForProperty(propId: string, mode: Mode): FranchiseeAlert[] {
  const templates = mode === 'platform' ? PLATFORM_ALERT_TEMPLATES : FRANCHISEE_ALERT_TEMPLATES
  return templates.map((t, i) => ({
    id: `fa-${propId}-${i}`,
    severity: t.severity,
    title: t.title,
    body: t.body,
    property_id: propId,
    recommended_action: t.recommended_action,
  }))
}
