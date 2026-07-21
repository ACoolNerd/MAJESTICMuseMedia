import { AlertTriangle, CheckCircle2, Clock3, Database } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useOperations } from '../features/operations/OperationsContext';
import type { TaskRecord } from '../features/operations/types';

const statuses: TaskRecord['status'][] = ['Open', 'In Progress', 'Blocked', 'Done'];
const priorities: TaskRecord['priority'][] = ['Low', 'Normal', 'High', 'Critical'];

export default function Tasks() {
  const { tasks, episodes, loading, persistenceMode, saveTask } = useOperations();
  if (loading) return <AppShell><p>Loading production tasks…</p></AppShell>;

  const openCount = tasks.filter(task => task.status !== 'Done').length;
  const blockedCount = tasks.filter(task => task.status === 'Blocked').length;
  const criticalCount = tasks.filter(task => task.priority === 'Critical' && task.status !== 'Done').length;

  async function patch(task: TaskRecord, changes: Partial<TaskRecord>) {
    await saveTask({ ...task, ...changes });
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Production Tasks</h1><p className="mt-2 text-[#1B1734]/60">Every blocker has an owner, priority, evidence source and next status.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={14}/>{persistenceMode}</span></div>
    <section className="mt-7 grid gap-4 sm:grid-cols-3">{[[openCount,'Open work'],[blockedCount,'Blocked'],[criticalCount,'Critical']].map(([value,label]) => <article key={String(label)} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><p className="font-serif text-4xl">{value}</p><p className="mt-2 text-sm text-[#1B1734]/50">{label}</p></article>)}</section>
    <section className="mt-6 space-y-4">{tasks.map(task => {
      const episode = episodes.find(item => item.id === task.episodeId);
      return <article key={task.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="grid gap-5 lg:grid-cols-[1fr_170px_160px] lg:items-center">
          <div><div className="flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${task.priority === 'Critical' ? 'bg-red-100 text-red-800' : task.priority === 'High' ? 'bg-amber-100 text-amber-900' : 'bg-[#F8F4EC]'}`}>{task.priority}</span><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{task.assignedRole.toUpperCase()}</span>{episode && <span className="rounded-full bg-[#1B1734] px-3 py-1 text-xs text-white">{episode.code}</span>}</div><h2 className="mt-4 font-serif text-2xl">{task.title}</h2><p className="mt-2 text-xs text-[#1B1734]/45">Source: {task.sourceReference}</p>{task.blocker && <p className="mt-4 flex items-start gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-800"><AlertTriangle size={17} className="mt-0.5 shrink-0"/>{task.blocker}</p>}</div>
          <label className="text-xs font-semibold">Status<select value={task.status} onChange={event => void patch(task, { status: event.target.value as TaskRecord['status'] })} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
          <label className="text-xs font-semibold">Priority<select value={task.priority} onChange={event => void patch(task, { priority: event.target.value as TaskRecord['priority'] })} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{priorities.map(priority => <option key={priority}>{priority}</option>)}</select></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#1B1734]/50">{task.dueDate && <span className="inline-flex items-center gap-1"><Clock3 size={14}/>Due {new Date(`${task.dueDate}T12:00:00`).toLocaleDateString()}</span>}<span className="inline-flex items-center gap-1"><CheckCircle2 size={14}/>Updated {new Date(task.updatedAt).toLocaleDateString()}</span></div>
      </article>;
    })}</section>
  </AppShell>;
}
