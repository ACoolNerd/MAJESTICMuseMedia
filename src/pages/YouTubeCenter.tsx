import { AlertTriangle, CheckCircle2, Radio, UploadCloud } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { actionAvailability } from '../features/platforms/adapters';
import { usePlatforms } from '../features/platforms/PlatformContext';

export default function YouTubeCenter() {
  const { connections, events, jobs } = usePlatforms();
  const connection = connections.find(item => item.platform === 'YouTube');
  const youtubeJobs = jobs.filter(item => item.platform === 'YouTube');

  return <AppShell>
    <div><h1 className="font-serif text-4xl">YouTube Operating Center</h1><p className="mt-2 text-[#1B1734]/60">Live-event preparation, upload approval, returned visibility and post-release verification.</p></div>
    <section className="mt-7 grid gap-5 xl:grid-cols-[.7fr_1.3fr]">
      <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">Connection</p><h2 className="mt-2 font-serif text-3xl">{connection?.testMode ? 'Test mode' : connection?.state ?? 'Missing'}</h2></div>{connection?.state === 'Connected' || connection?.testMode ? <CheckCircle2 className="text-green-700"/> : <AlertTriangle className="text-amber-700"/>}</div>
        <div className="mt-5 flex flex-wrap gap-2">{connection && actionAvailability(connection.capabilities).map(action => <span key={action} className="rounded-full bg-[#F8F4EC] px-3 py-1.5 text-[11px] font-semibold">{action}</span>)}</div>
        <p className="mt-5 text-sm leading-6 text-[#1B1734]/55">OAuth, refresh tokens and client secrets belong in the trusted server runtime. The browser receives connection status and approved action results only.</p>
      </article>
      <article className="rounded-[2rem] bg-[#1B1734] p-6 text-white"><div className="flex items-center gap-3"><Radio className="text-[#C9A227]"/><h2 className="font-serif text-2xl">Broadcast lifecycle</h2></div><div className="mt-5 grid gap-3 md:grid-cols-4">{['Create broadcast','Create or select stream','Bind broadcast to stream','Verify and transition state'].map((step, index) => <div key={step} className="rounded-2xl border border-white/10 p-4"><p className="text-xs font-bold text-[#D8A7B1]">0{index + 1}</p><p className="mt-2 text-sm font-semibold">{step}</p></div>)}</div><p className="mt-5 text-sm leading-6 text-white/60">Every external broadcast, stream and live-chat identifier must be stored on the live-event record. State transitions remain unavailable until the returned platform status and stream health are verified.</p></article>
    </section>

    <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex items-center gap-3"><UploadCloud className="text-[#8B2C6F]"/><h2 className="font-serif text-2xl">Approval queue</h2></div><div className="mt-5 space-y-3">{youtubeJobs.map(job => <div key={job.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#1B1734]/8 p-4 md:flex-row md:items-center"><div><p className="text-xs font-bold text-[#8B2C6F]">{job.action}</p><p className="mt-1 font-semibold">{job.id}</p><p className="mt-1 text-xs text-[#1B1734]/45">{job.status} · attempts {job.attempts}</p></div><span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold">{job.returnedVisibility ? `Visibility: ${job.returnedVisibility}` : 'Visibility not returned'}</span></div>)}</div></section>

    <section className="mt-6 grid gap-5 md:grid-cols-2"><article className="rounded-[2rem] bg-white p-6 ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Live-event records</h2><p className="mt-3 text-sm leading-6 text-[#1B1734]/55">{events.filter(event => event.platforms.includes('YouTube')).length} event record(s) currently include YouTube.</p></article><article className="rounded-[2rem] bg-amber-50 p-6 text-amber-950"><h2 className="font-serif text-2xl">Upload is not publication</h2><p className="mt-3 text-sm leading-6">The system must read and store YouTube’s returned privacy and processing states. It must never convert a successful upload request into a Public status by assumption.</p></article></section>
  </AppShell>;
}
