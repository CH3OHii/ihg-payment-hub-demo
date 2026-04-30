import { useState } from 'react'
import { useMode } from '../../../state/ModeContext'
import { complianceFor } from '../../../data/mockFranchisee'
import { ShieldCheck, ShieldAlert, ChevronRight } from 'lucide-react'

export default function CompliancePill() {
  const { mode, franchiseePropertyId } = useMode()
  const c = complianceFor(franchiseePropertyId, mode)
  const [open, setOpen] = useState(false)
  const tone = c.overallTone === 'green' ? 'success' : 'warn'
  const Icon = tone === 'success' ? ShieldCheck : ShieldAlert

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`w-full text-left rounded-card border px-4 py-3 flex items-center gap-3 transition-colors ${
          tone === 'success'
            ? 'border-success/30 bg-success/5 hover:bg-success/10'
            : 'border-warn/40 bg-warn/5 hover:bg-warn/10'
        }`}
      >
        <Icon
          size={18}
          strokeWidth={2.1}
          className={tone === 'success' ? 'text-success' : 'text-warn'}
        />
        <div className="flex-1">
          <div className="text-[12.5px] font-medium text-navy-dark">
            {c.fapiaoEligible ? 'Special VAT fapiao eligible' : 'General taxpayer (standard fapiao)'}
            {' · '}
            <span className={tone === 'success' ? 'text-success' : 'text-warn'}>
              {mode === 'platform'
                ? `${c.fapiaoIssuedToday}/${c.fapiaoBatchSize} issued today`
                : `Last batch ${c.fapiaoBatchDate} · ${c.fapiaoBatchSize - c.fapiaoIssuedToday} pending`}
            </span>
          </div>
          <div className="text-[11px] text-slate2 mt-0.5">
            PBOC cutoff:{' '}
            <span className={c.pbocCutoffMet ? 'text-success' : 'text-warn'}>
              {c.pbocCutoffMet ? 'cleared' : 'awaiting confirmation'}
            </span>
            {' · '}
            Data localization:{' '}
            <span className="text-success">{c.dataLocalizationOK ? 'compliant' : 'review needed'}</span>
            {' · '}
            PCI cert:{' '}
            <span className={c.pciCertExpiresInDays > 30 ? 'text-success' : 'text-warn'}>
              {c.pciCertExpiresInDays} days
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate2" />
      </button>

      {open && <ComplianceDrawer onClose={() => setOpen(false)} />}
    </>
  )
}

function ComplianceDrawer({ onClose }: { onClose: () => void }) {
  const { mode, franchiseePropertyId } = useMode()
  const c = complianceFor(franchiseePropertyId, mode)

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-navy-dark/30 backdrop-blur-[1px]" />
      <aside
        className="absolute right-0 top-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-xl flex flex-col animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        <header className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-slate2">Compliance</div>
            <h3 className="font-serif text-[17px] text-navy-dark mt-1">Today's compliance status</h3>
          </div>
          <button onClick={onClose} className="text-slate2 hover:text-navy-dark text-[18px] leading-none">×</button>
        </header>

        <div className="px-5 py-4 flex-1 overflow-auto flex flex-col gap-4">
          <Section
            title="Fapiao (VAT invoice)"
            tone={c.fapiaoIssuedToday > 0 ? 'good' : 'warn'}
            body={
              <>
                <Row k="Eligibility" v={c.fapiaoEligible ? 'Special VAT taxpayer' : 'General taxpayer'} />
                <Row k="Issued today" v={`${c.fapiaoIssuedToday} / ${c.fapiaoBatchSize}`} />
                <Row k="Last batch" v={c.fapiaoBatchDate} />
              </>
            }
          />
          <Section
            title="PBOC merchant transfer"
            tone={c.pbocCutoffMet ? 'good' : 'warn'}
            body={
              <>
                <Row k="24h cutoff" v={c.pbocCutoffMet ? 'Met' : 'Pending verification'} />
                <Row k="Channels in scope" v="Alipay · WeChat Pay · UnionPay" />
              </>
            }
          />
          <Section
            title="Data localization (网络安全法 / 数据安全法 / 个保法)"
            tone="good"
            body={
              <>
                <Row k="Storage region" v="China (Shanghai · Beijing replicas)" />
                <Row k="Cross-border" v="Disabled · scope-zero" />
              </>
            }
          />
          <Section
            title="PCI DSS"
            tone={c.pciCertExpiresInDays > 30 ? 'good' : 'warn'}
            body={
              <Row k="Cert expires in" v={`${c.pciCertExpiresInDays} days`} />
            }
          />
        </div>

        <footer className="border-t border-slate-100 p-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] text-navy-dark border border-slate-200 hover:bg-slate-50">
            Close
          </button>
        </footer>
      </aside>
    </div>
  )
}

function Section({ title, tone, body }: { title: string; tone: 'good' | 'warn'; body: React.ReactNode }) {
  return (
    <section>
      <div className={`text-[11px] uppercase tracking-[0.14em] mb-1 ${tone === 'good' ? 'text-success' : 'text-warn'}`}>
        {title}
      </div>
      <div className="bg-slate-50 rounded-md p-3 text-[12.5px] flex flex-col gap-1">{body}</div>
    </section>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate2">{k}</span>
      <span className="text-navy-dark font-medium">{v}</span>
    </div>
  )
}
