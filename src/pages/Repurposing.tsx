import { AlertTriangle, Clock3, Sparkles } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useGrowth } from '../features/intelligence/GrowthContext';

function time(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export default function Repurposing() {
  const { moments, persistenceMode } = useGrowth();

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]"><Sparkles size={14}/>Content Intelligence</span><h1 className="mt-4 font-serif text-4xl">Repurposing Map</h1><p className="mt-2 text-[#1B1734]/60">Candidate moments become clips, captions and trackable journeys only after transcript and rights validation.</p></div><span className="rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8">{persistenceMode}</span></div>
    <section className="mt-7 grid gap-5 lg:grid-cols-2">{moments.map(moment => <article key={moment.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{moment.recommendedPlatform} · {moment.aspectRatio}</p><h2 className="mt-2 font-serif text-2xl">{moment.hook}</h2></div><span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#F8F4EC] px-3 py-1 text-xs"><Clock3 size={13}/>{time(moment.startSeconds)}–{time(moment.endSeconds)}</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><Metric label="Speaker" value={moment.speaker}/><Metric label="Tone" value={moment.emotionalTone}/><Metric label="Confidence" value={`${Math.round(moment.confidence * 100)}%`}/></div>
      <p className="mt-5 text-sm leading-7 text-[#1B1734]/65">{moment.caption}</p><p className="mt-4 rounded-2xl bg-[#1B1734] p-4 text-sm text-white"><strong>CTA:</strong> {moment.cta}</p>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-amber-800"><AlertTriangle size={15} className="mt-0.5 shrink-0"/>{moment.sourceReference}. Do not publish an exact quote until the approved transcript confirms it.</p>
    </article>)}</section>
    <section className="mt-6 rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Required AI output contract</h2><p className="mt-3 max-w-4xl leading-7 text-white/65">A trusted Gemini service may propose timestamps, hooks, platforms and captions using structured output. The application must validate the JSON, compare exact quotes against the approved transcript, surface confidence and sensitivity flags, and keep every derivative in review until a human approves it.</p></section>
  </AppShell>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-3"><p className="text-[11px] text-[#1B1734]/45">{label}</p><p className="mt-1 text-xs font-semibold">{value}</p></div>;
}
