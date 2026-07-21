import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { useOperations } from '../features/operations/OperationsContext';
import type { ApprovalRecord } from '../features/operations/types';

const statuses: ApprovalRecord['status'][] = ['Pending', 'Approved', 'Changes Requested', 'Waived with Written Reason'];

function mayAct(record: ApprovalRecord, role: string): boolean {
  if (record.requestedFromRole === role) return true;
  return role === 'ceo' && ['Editorial', 'Brand', 'Release'].includes(record.type);
}

export default function Approvals() {
  const { user } = useAuth();
  const { approvals, episodes, loading, saveApproval } = useOperations();
  if (loading) return <AppShell><p>Loading approval records…</p></AppShell>;

  const pending = approvals.filter(item => item.status === 'Pending' || item.status === 'Changes Requested').length;

  async function update(record: ApprovalRecord, status: ApprovalRecord['status']) {
    if (!user || !mayAct(record, user.role)) return;
    await saveApproval({ ...record, status });
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Approval Inbox</h1><p className="mt-2 text-[#1B1734]/60">Editorial, technical, brand, rights, metadata and release decisions remain role-bound and evidenced.</p></div><span className="rounded-full bg-[#8B2C6F]/10 px-4 py-2 text-sm font-bold text-[#8B2C6F]">{pending} need action</span></div>
    <section className="mt-7 space-y-4">{approvals.map(record => {
      const episode = episodes.find(item => item.id === record.episodeId);
      const actionable = Boolean(user && mayAct(record, user.role));
      return <article key={record.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="grid gap-5 lg:grid-cols-[1fr_240px] lg:items-center">
          <div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{record.type}</span><span className="rounded-full bg-[#1B1734] px-3 py-1 text-xs text-white">{episode?.code ?? record.episodeId}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${record.status === 'Approved' ? 'bg-green-100 text-green-800' : record.status === 'Changes Requested' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>{record.status}</span></div><h2 className="mt-4 font-serif text-2xl">{episode?.title ?? 'Episode approval'}</h2><p className="mt-2 text-sm leading-6 text-[#1B1734]/60">{record.note ?? 'No review note has been recorded.'}</p><div className="mt-4 flex flex-wrap gap-4 text-xs text-[#1B1734]/45"><span className="inline-flex items-center gap-1"><ShieldCheck size={14}/>Requested from {record.requestedFromRole.toUpperCase()}</span><span className="inline-flex items-center gap-1"><Clock3 size={14}/>Updated {new Date(record.updatedAt).toLocaleDateString()}</span>{record.evidenceReference && <span>Evidence: {record.evidenceReference}</span>}</div></div>
          <div><label className="text-xs font-semibold">Decision<select disabled={!actionable} value={record.status} onChange={event => void update(record, event.target.value as ApprovalRecord['status'])} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">{statuses.map(status => <option key={status}>{status}</option>)}</select></label>{actionable ? <p className="mt-3 flex items-center gap-2 text-xs text-green-700"><CheckCircle2 size={14}/>Your role may act on this decision.</p> : <p className="mt-3 flex items-center gap-2 text-xs text-amber-800"><AlertTriangle size={14}/>Awaiting the assigned authority.</p>}</div>
        </div>
      </article>;
    })}</section>
    <section className="mt-6 rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Approval is not a bypass</h2><p className="mt-3 max-w-4xl leading-7 text-white/65">A release approval cannot substitute for missing technical, rights, brand or metadata evidence. Written waivers must state the reason and remain visible in the audit trail.</p></section>
  </AppShell>;
}
