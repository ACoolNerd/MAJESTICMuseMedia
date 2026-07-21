import { useState } from 'react';
import { AlertTriangle, Cable, CheckCircle2, Radio, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { actionAvailability } from '../features/platforms/adapters';
import { usePlatforms } from '../features/platforms/PlatformContext';
import type { AdapterHealth, PlatformName } from '../features/platforms/types';

export default function LiveControl() {
  const { connections, events, loading, error, persistenceMode, checkHealth, setTestMode } = usePlatforms();
  const [health, setHealth] = useState<Partial<Record<PlatformName, AdapterHealth>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const event = events[0];

  async function runHealth(platform: PlatformName) {
    try {
      const result = await checkHealth(platform);
      setHealth(current => ({ ...current, [platform]: result }));
      setMessage(`${platform} health check completed.`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Health check failed.');
    }
  }

  if (loading) return <AppShell><p>Loading live control records…</p></AppShell>;

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Livestream Control Room</h1><p className="mt-2 text-[#1B1734]/60">One run-of-show with platform-specific actions, health and external references.</p></div><span className="rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8">{persistenceMode}</span></div>
    {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Platform records fell back to source-grounded demo data: {error}</p>}
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}

    {event && <section className="mt-7 rounded-[2rem] bg-[#1B1734] p-6 text-white">
      <div className="flex flex-col justify-between gap-5 md:flex-row"><div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs"><Radio size={14}/>{event.status}</span><h2 className="mt-4 font-serif text-3xl">{event.title}</h2><p className="mt-2 text-white/60">{new Date(event.scheduledStart).toLocaleString()} · {event.platforms.join(' + ')}</p></div><div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">Pinned CTA</p><p className="mt-2 text-sm leading-6 text-white/70">{event.pinnedCta}</p></div></div>
      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">{event.runOfShow.map(item => <div key={`${item.time}-${item.segment}`} className="rounded-2xl border border-white/10 p-4"><p className="text-xs font-bold text-[#D8A7B1]">{item.time}</p><p className="mt-2 text-sm font-semibold">{item.segment}</p><p className="mt-2 text-xs text-white/45">Owner: {item.owner}</p></div>)}</div>
    </section>}

    <section className="mt-6 grid gap-5 xl:grid-cols-3">{connections.map(connection => {
      const result = health[connection.platform];
      const actions = actionAvailability(connection.capabilities);
      return <article key={connection.platform} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{connection.platform}</p><h2 className="mt-2 font-serif text-2xl">{connection.state}</h2></div>{connection.state === 'Connected' || connection.testMode ? <CheckCircle2 className="text-green-700"/> : <AlertTriangle className="text-amber-700"/>}</div>
        <p className="mt-4 text-sm leading-6 text-[#1B1734]/55">{result?.message ?? 'Run a health check. No external request occurs unless a trusted production adapter is connected.'}</p>
        <div className="mt-5 flex flex-wrap gap-2">{actions.map(action => <span key={action} className="rounded-full bg-[#F8F4EC] px-3 py-1.5 text-[11px] font-semibold">{action}</span>)}</div>
        <div className="mt-5 grid gap-2"><button onClick={() => void runHealth(connection.platform)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B1734] px-4 py-2.5 text-sm font-semibold text-white"><Cable size={16}/>Check health</button><label className="flex items-center justify-between rounded-2xl border border-[#1B1734]/10 p-3 text-xs"><span><strong>Test mode</strong><br/><span className="text-[#1B1734]/45">No external action</span></span><input type="checkbox" checked={connection.testMode} onChange={event => void setTestMode(connection.platform, event.target.checked)}/></label></div>
        {result && <p className="mt-4 flex items-center gap-2 text-xs text-[#1B1734]/45"><ShieldCheck size={14}/>Checked {new Date(result.checkedAt).toLocaleTimeString()}</p>}
      </article>;
    })}</section>
  </AppShell>;
}
