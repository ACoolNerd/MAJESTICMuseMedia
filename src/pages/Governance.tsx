import { useMemo, useState } from 'react';
import { AlertTriangle, History, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { useOperations } from '../features/operations/OperationsContext';
import type { RasciCode, RasciRole, RasciWorkstreamRecord } from '../features/operations/types';

const roles: Array<{ key: RasciRole; label: string }> = [
  { key: 'ceo', label: 'Marchette' },
  { key: 'coo', label: 'Keith / ACoolNERD' },
  { key: 'post', label: 'Brian' },
  { key: 'social', label: 'Ares' },
  { key: 'crew', label: 'Crew' },
];
const codes: RasciCode[] = ['', 'R', 'A', 'S', 'C', 'I', 'A/R', 'R/S', 'A/S', 'C/S'];

function hasIntegrity(record: RasciWorkstreamRecord): boolean {
  const values = Object.values(record.assignments);
  return values.some(value => value.includes('A')) && values.some(value => value.includes('R'));
}

export default function Governance() {
  const { user } = useAuth();
  const { rasci, loading, saveRasci } = useOperations();
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const canEdit = user?.role === 'ceo' || user?.role === 'coo';
  const integrityIssues = useMemo(() => rasci.filter(record => !hasIntegrity(record)), [rasci]);
  if (loading) return <AppShell><p>Loading governance matrix…</p></AppShell>;

  async function change(record: RasciWorkstreamRecord, role: RasciRole, code: RasciCode) {
    if (!user || !canEdit) return;
    if (reason.trim().length < 5) {
      setMessage('Enter a change reason of at least five characters before editing the RASCI matrix.');
      return;
    }
    const next: RasciWorkstreamRecord = {
      ...record,
      assignments: { ...record.assignments, [role]: code },
      updatedByRole: user.role,
      changeReason: reason.trim(),
      history: [
        ...(record.history ?? []),
        {
          changedAt: new Date().toISOString(),
          changedByRole: user.role,
          reason: reason.trim(),
          previousAssignments: { ...record.assignments },
        },
      ],
    };
    await saveRasci(next);
    setMessage(`${record.workstream} updated. The previous assignment set was retained in history.`);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Governance and RASCI</h1><p className="mt-2 text-[#1B1734]/60">Accountability, execution, support, consultation and information responsibilities across the operating system.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><ShieldCheck size={14}/>{rasci.length} workstreams</span></div>
    <section className="mt-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#1B1734]/5"><label className="text-sm font-semibold">Required change reason<input value={reason} onChange={event => setReason(event.target.value)} disabled={!canEdit} placeholder={canEdit ? 'Why is this assignment changing?' : 'Executive edit access required'} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 px-4 py-3 disabled:bg-[#F8F4EC]"/></label><p className="mt-2 text-xs text-[#1B1734]/45">Only the CEO or COO may edit governance assignments. Every edit stores the previous matrix, reason, time and acting role.</p></section>
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    {integrityIssues.length > 0 && <p className="mt-5 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0"/>{integrityIssues.length} workstream(s) do not currently contain both an Accountable and Responsible assignment.</p>}

    <section className="mt-6 overflow-x-auto rounded-[2rem] bg-white shadow-sm ring-1 ring-[#1B1734]/5">
      <table className="min-w-[980px] w-full border-collapse text-sm"><thead><tr className="bg-[#1B1734] text-white"><th className="px-5 py-4 text-left">Workstream</th>{roles.map(role => <th key={role.key} className="px-3 py-4 text-center">{role.label}</th>)}<th className="px-3 py-4 text-center">History</th></tr></thead><tbody>{rasci.map((record, index) => <tr key={record.id} className={index % 2 ? 'bg-[#F8F4EC]/55' : 'bg-white'}><td className="px-5 py-4"><p className="font-semibold">{record.workstream}</p><p className="mt-1 text-[11px] text-[#1B1734]/40">{record.sourceReference}</p></td>{roles.map(role => <td key={role.key} className="px-3 py-3 text-center"><select aria-label={`${record.workstream} ${role.label}`} disabled={!canEdit} value={record.assignments[role.key]} onChange={event => void change(record, role.key, event.target.value as RasciCode)} className="w-20 rounded-xl border border-[#1B1734]/15 bg-white px-2 py-2 text-center text-xs font-bold disabled:bg-transparent">{codes.map(code => <option key={code || 'blank'} value={code}>{code || '—'}</option>)}</select></td>)}<td className="px-3 py-3 text-center"><button onClick={() => setHistoryId(historyId === record.id ? null : record.id)} className="inline-flex items-center gap-1 rounded-full border border-[#1B1734]/15 px-3 py-2 text-xs"><History size={13}/>{record.history?.length ?? 0}</button></td></tr>)}</tbody></table>
    </section>

    {historyId && (() => {
      const record = rasci.find(item => item.id === historyId);
      return record ? <section className="mt-6 rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Change history — {record.workstream}</h2><div className="mt-4 space-y-3">{record.history?.length ? [...record.history].reverse().map(entry => <article key={`${entry.changedAt}-${entry.reason}`} className="rounded-2xl border border-white/10 p-4"><p className="text-sm font-semibold">{entry.reason}</p><p className="mt-2 text-xs text-white/45">{entry.changedByRole.toUpperCase()} · {new Date(entry.changedAt).toLocaleString()}</p><p className="mt-2 text-xs text-white/60">Previous: {Object.entries(entry.previousAssignments).map(([role, code]) => `${role.toUpperCase()}=${code || '—'}`).join(' · ')}</p></article>) : <p className="text-white/60">No changes have been recorded.</p>}</div></section> : null;
    })()}
  </AppShell>;
}
