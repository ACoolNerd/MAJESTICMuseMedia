import { useState } from 'react';
import { AlertTriangle, Database, UserRoundCheck } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useGrowth } from '../features/intelligence/GrowthContext';
import type { LeadRecord, LeadStatus } from '../features/intelligence/types';

const statuses: LeadStatus[] = ['New','Reviewing','Qualified','Contacted','Meeting Scheduled','Proposal','Active','Won','Nurture','Not a Fit','Closed'];

export default function Leads() {
  const { leads, saveLead, loading, error, persistenceMode } = useGrowth();
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <AppShell><p>Loading lead records…</p></AppShell>;

  async function updateStatus(lead: LeadRecord, status: LeadStatus) {
    await saveLead({ ...lead, status });
    setMessage(`${lead.name} moved to ${status}.`);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Lead and Partnership CRM</h1><p className="mt-2 text-[#1B1734]/60">Guest, sponsor, partner, service and community opportunities with consent and attribution.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={14}/>{persistenceMode}</span></div>
    {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Using source-grounded planning records because persistence returned: {error}</p>}
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    <div className="mt-7 grid gap-5 lg:grid-cols-2">{leads.map(lead => <article key={lead.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
      <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2C6F]/10 text-[#8B2C6F]"><UserRoundCheck/></span><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{lead.leadType}</p><h2 className="mt-1 font-serif text-2xl">{lead.name}</h2></div></div><span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold">Score {lead.score}</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Source" value={lead.source}/><Metric label="Owner" value={lead.assignedRole.toUpperCase()}/><Metric label="Consent" value={lead.consent ? 'Recorded' : 'Not recorded'}/></div>
      {!lead.consent && <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-900"><AlertTriangle size={15} className="mt-0.5 shrink-0"/>Do not send promotional outreach until a lawful contact basis and the required consent or business-purpose record is established.</p>}
      <p className="mt-5 text-sm leading-6 text-[#1B1734]/60"><strong>Next action:</strong> {lead.nextAction ?? 'Assign a next action.'}</p>
      <label className="mt-5 block text-xs font-semibold">Pipeline status<select value={lead.status} onChange={event => void updateStatus(lead, event.target.value as LeadStatus)} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
    </article>)}</div>
  </AppShell>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-3"><p className="text-[11px] text-[#1B1734]/45">{label}</p><p className="mt-1 text-xs font-semibold">{value}</p></div>;
}
