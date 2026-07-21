import { AlertTriangle, BarChart3, CalendarClock, Database } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useGrowth } from '../features/intelligence/GrowthContext';
import { useOperations } from '../features/operations/OperationsContext';

const targets = [
  ['Episodes per month', '4'],
  ['Scheduled-release rate', '95%+'],
  ['Release-gate completion', '100%'],
  ['Guest amplification', '80%'],
  ['YouTube CTR', '5–6% initial'],
  ['Average percentage viewed', '35–40% initial'],
];

export default function Analytics() {
  const { analytics, moments, loading, error, persistenceMode } = useGrowth();
  const { episodes } = useOperations();
  if (loading) return <AppShell><p>Loading analytics records…</p></AppShell>;

  const scheduled = episodes.filter(item => item.status === 'Scheduled' || item.status === 'Published').length;
  const proposed = episodes.filter(item => item.status === 'Proposed' || item.status === 'TBD').length;
  const completedAssets = episodes.reduce((sum, item) => sum + item.completedAssets, 0);
  const targetAssets = episodes.reduce((sum, item) => sum + item.targetAssets, 0);

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Analytics and Learning</h1><p className="mt-2 text-[#1B1734]/60">Coverage-aware scorecards that separate measured data from planning targets.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={14}/>{persistenceMode}</span></div>
    {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Using planning snapshots because persistence returned: {error}</p>}
    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      ['Episodes loaded', String(episodes.length), `${scheduled} scheduled/published`],
      ['Proposed or TBD', String(proposed), 'Not treated as confirmed'],
      ['Assets complete', String(completedAssets), `${targetAssets} configured target`],
      ['Repurposing moments', String(moments.length), 'Transcript validation required'],
    ].map(([label, value, note]) => <article key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><p className="text-sm text-[#1B1734]/50">{label}</p><p className="mt-4 font-serif text-4xl">{value}</p><p className="mt-2 text-xs text-[#1B1734]/45">{note}</p></article>)}</section>

    <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex items-center gap-3"><BarChart3 className="text-[#8B2C6F]"/><h2 className="font-serif text-2xl">Analytics snapshots</h2></div><div className="mt-5 space-y-4">{analytics.map(snapshot => <article key={snapshot.id} className="rounded-2xl border border-[#1B1734]/8 p-4"><div className="flex flex-col justify-between gap-3 md:flex-row"><div><p className="text-xs font-bold text-[#8B2C6F]">{snapshot.source} · {snapshot.period}</p><p className="mt-1 font-semibold">Episode {snapshot.episodeId}</p></div><span className="inline-flex items-center gap-1 text-xs text-[#1B1734]/45"><CalendarClock size={14}/>Coverage through {new Date(snapshot.coverageThrough).toLocaleString()}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(snapshot.metrics).map(([key, value]) => <div key={key} className="rounded-xl bg-[#F8F4EC] p-3"><p className="text-[11px] text-[#1B1734]/45">{key}</p><p className="mt-1 font-semibold">{value}</p></div>)}</div>{snapshot.notes && <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-amber-800"><AlertTriangle size={15} className="mt-0.5 shrink-0"/>{snapshot.notes}</p>}</article>)}</div></section>
      <aside className="rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Operating targets</h2><p className="mt-2 text-sm leading-6 text-white/55">Targets guide decisions; they are not measured achievements until a dated source provides evidence.</p><div className="mt-5 space-y-3">{targets.map(([label, value]) => <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 p-4"><span className="text-sm text-white/70">{label}</span><strong className="text-[#D8A7B1]">{value}</strong></div>)}</div></aside>
    </div>
  </AppShell>;
}
