import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Database, Save } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { hasPermission } from '../features/auth/permissions';
import { useOperations } from '../features/operations/OperationsContext';
import { assetMatrixIntegrity, canConfirmStatus, canTransitionEpisode, releaseReadiness } from '../features/operations/workflow';
import type { EpisodeStage, Status } from '../types';

const stages: EpisodeStage[] = ['Concept','Guest Development','Pre-Production','Production Capture','Create / Ingest','Cut','Package','Release','Amplify','Learn'];
const statuses: Status[] = ['Confirmed','Planned','Proposed','TBD','Blocked','In Progress','In Review','Approved','Scheduled','Published','Archived'];

export default function Episodes() {
  const { user } = useAuth();
  const { episodes, guests, loading, error, persistenceMode, saveEpisode } = useOperations();
  const [selectedId, setSelectedId] = useState('s01e01');
  const [message, setMessage] = useState<string | null>(null);
  const selected = useMemo(() => episodes.find(item => item.id === selectedId) ?? episodes[0], [episodes, selectedId]);
  const canEdit = Boolean(user && hasPermission(user.role, 'episodes.edit'));

  async function updateStage(stage: EpisodeStage) {
    if (!selected || !canEdit) return;
    const decision = canTransitionEpisode(selected, stage, guests);
    if (!decision.allowed) {
      setMessage(decision.blockers.join(' '));
      return;
    }
    await saveEpisode({ ...selected, stage });
    setMessage(`Stage updated to ${stage}.`);
  }

  async function updateStatus(status: Status) {
    if (!selected || !user || !canEdit) return;
    const decision = canConfirmStatus(selected.status, status, user.role);
    if (!decision.allowed) {
      setMessage(decision.blockers.join(' '));
      return;
    }
    await saveEpisode({ ...selected, status });
    setMessage(`Status updated to ${status}.`);
  }

  if (loading) return <AppShell><p>Loading operating records…</p></AppShell>;
  if (!selected) return <AppShell><p>No episodes are available.</p></AppShell>;

  const integrity = assetMatrixIntegrity(selected);
  const readiness = releaseReadiness(selected);

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><h1 className="font-serif text-4xl">Episode Operating System</h1><p className="mt-2 text-[#1B1734]/60">Ten-stage production control with truth-status, gates and source evidence.</p></div>
      <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={15}/>{persistenceMode}</div>
    </div>
    {error && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Using source-grounded seed data because persistence returned: {error}</p>}

    <div className="mt-7 grid gap-5 xl:grid-cols-[340px_1fr]">
      <aside className="space-y-3">{episodes.map(episode => <button key={episode.id} onClick={() => { setSelectedId(episode.id); setMessage(null); }} className={`w-full rounded-2xl p-4 text-left ring-1 transition ${episode.id === selected.id ? 'bg-[#1B1734] text-white ring-[#1B1734]' : 'bg-white ring-[#1B1734]/8 hover:ring-[#8B2C6F]'}`}><div className="flex items-center justify-between"><span className="text-xs font-bold text-[#D8A7B1]">{episode.code}</span><ChevronRight size={16}/></div><p className="mt-2 font-semibold">{episode.title}</p><p className={`mt-1 text-xs ${episode.id === selected.id ? 'text-white/60' : 'text-[#1B1734]/50'}`}>{episode.status} · {episode.stage}</p></button>)}</aside>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#1B1734]/5 md:p-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{selected.code} · {selected.status}</p><h2 className="mt-2 font-serif text-3xl">{selected.title}</h2><p className="mt-2 text-[#1B1734]/55">{selected.guestNames.join(' + ')} · {selected.theme}</p></div><div className="rounded-2xl bg-[#F8F4EC] p-4 text-center"><p className="text-xs text-[#1B1734]/50">Release readiness</p><p className="font-serif text-4xl">{readiness}%</p></div></div>

        <div className="mt-6 grid gap-4 md:grid-cols-3"><Info label="Recording" value={selected.recordingDate ?? 'TBD'}/><Info label="Release" value={selected.releaseDate ?? 'TBD'}/><Info label="Source" value={selected.sourceReference}/></div>

        {!integrity.valid && <p className="mt-5 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="mt-0.5 shrink-0"/>{integrity.message}</p>}
        {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}

        <div className="mt-7"><h3 className="font-serif text-2xl">Stage progression</h3><div className="mt-4 flex flex-wrap gap-2">{stages.map(stage => <button key={stage} disabled={!canEdit} onClick={() => void updateStage(stage)} className={`rounded-full px-3 py-2 text-xs font-semibold ${stage === selected.stage ? 'bg-[#8B2C6F] text-white' : 'bg-[#F8F4EC] text-[#1B1734]/65'} disabled:cursor-not-allowed disabled:opacity-50`}>{stage}</button>)}</div></div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <div><h3 className="font-serif text-2xl">Release gates</h3><div className="mt-4 space-y-3">{selected.gates.map(gate => <div key={gate.name} className="flex items-center justify-between rounded-2xl border border-[#1B1734]/8 p-4"><span>{gate.name}</span><span className="flex items-center gap-2 text-xs font-semibold">{gate.status === 'Passed' ? <CheckCircle2 size={16} className="text-green-700"/> : <AlertTriangle size={16} className="text-amber-700"/>}{gate.status}</span></div>)}</div></div>
          <div><h3 className="font-serif text-2xl">Truth status</h3><p className="mt-2 text-sm leading-6 text-[#1B1734]/55">Proposed and TBD records cannot silently become Confirmed. Executive authority is required.</p><select disabled={!canEdit} value={selected.status} onChange={event => void updateStatus(event.target.value as Status)} className="mt-4 w-full rounded-2xl border border-[#1B1734]/15 bg-white px-4 py-3"><option disabled>Choose status</option>{statuses.map(status => <option key={status}>{status}</option>)}</select><div className="mt-4 rounded-2xl bg-[#F8F4EC] p-4"><div className="flex justify-between text-sm"><span>Assets complete</span><strong>{selected.completedAssets}/{selected.targetAssets}</strong></div><div className="mt-3 h-2 rounded-full bg-[#1B1734]/10"><div className="h-2 rounded-full bg-[#8B2C6F]" style={{ width: `${Math.min(selected.completedAssets / selected.targetAssets * 100, 100)}%` }}/></div></div></div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-[#1B1734]/45"><Save size={14}/>Changes persist to {persistenceMode === 'Firestore' ? 'the authorized Firestore project' : 'this browser’s local demo storage'}.</p>
      </section>
    </div>
  </AppShell>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-4"><p className="text-xs text-[#1B1734]/45">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}
