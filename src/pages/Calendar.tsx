import { useState } from 'react';
import { AlertTriangle, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { useOperations } from '../features/operations/OperationsContext';
import type { CalendarItemRecord } from '../features/operations/types';
import { canConfirmStatus } from '../features/operations/workflow';
import type { Status } from '../types';

const statuses: Status[] = ['Confirmed','Planned','Proposed','TBD','Blocked','In Progress','In Review','Approved','Scheduled','Published','Archived'];

export default function Calendar() {
  const { user } = useAuth();
  const { calendarItems, episodes, loading, saveCalendarItem } = useOperations();
  const [message, setMessage] = useState<string | null>(null);
  if (loading) return <AppShell><p>Loading production calendar…</p></AppShell>;

  async function changeStatus(item: CalendarItemRecord, status: Status) {
    if (!user) return;
    const decision = canConfirmStatus(item.status, status, user.role);
    if (!decision.allowed) {
      setMessage(decision.blockers.join(' '));
      return;
    }
    await saveCalendarItem({ ...item, status });
    setMessage(`${item.title} updated to ${status}.`);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Production Calendar</h1><p className="mt-2 text-[#1B1734]/60">Recording, release, livestream, deadline and promotion dates with visible truth status.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><CalendarDays size={15}/>{calendarItems.length} scheduled records</span></div>
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    <section className="mt-7 space-y-4">{calendarItems.map(item => {
      const episode = episodes.find(record => record.id === item.episodeId);
      const date = new Date(item.startAt);
      const unconfirmed = item.status === 'Proposed' || item.status === 'TBD';
      return <article key={item.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="grid gap-5 lg:grid-cols-[150px_1fr_220px] lg:items-center">
          <div className="rounded-2xl bg-[#1B1734] p-4 text-center text-white"><p className="text-xs uppercase tracking-widest text-[#D8A7B1]">{date.toLocaleDateString(undefined, { month: 'short' })}</p><p className="mt-1 font-serif text-4xl">{date.getDate()}</p><p className="mt-1 text-xs text-white/55">{date.toLocaleDateString(undefined, { weekday: 'long' })}</p></div>
          <div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{item.type}</span><span className={`rounded-full px-3 py-1 text-xs font-bold ${unconfirmed ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-800'}`}>{item.status}</span>{episode && <span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold">{episode.code}</span>}</div><h2 className="mt-4 font-serif text-2xl">{item.title}</h2><div className="mt-3 flex flex-wrap gap-4 text-xs text-[#1B1734]/50"><span className="inline-flex items-center gap-1"><Clock3 size={14}/>{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>{item.location && <span className="inline-flex items-center gap-1"><MapPin size={14}/>{item.location}</span>}<span>Owner: {item.ownerRole.toUpperCase()}</span></div><p className="mt-3 text-xs text-[#1B1734]/40">Source: {item.sourceReference}</p></div>
          <div><label className="text-xs font-semibold">Truth status<select value={item.status} onChange={event => void changeStatus(item, event.target.value as Status)} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{statuses.map(status => <option key={status}>{status}</option>)}</select></label>{unconfirmed && <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-amber-800"><AlertTriangle size={14} className="mt-0.5 shrink-0"/>This date is not confirmed and must not be presented publicly as final.</p>}</div>
        </div>
      </article>;
    })}</section>
  </AppShell>;
}
