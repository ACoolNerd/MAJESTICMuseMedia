import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, Send } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { useOperations } from '../features/operations/OperationsContext';
import { usePlatforms } from '../features/platforms/PlatformContext';
import { canApproveDistributionJob, canExecuteDistributionJob, verifyReturnedState } from '../features/platforms/workflow';
import type { DistributionJobRecord } from '../features/platforms/types';

export default function Distribution() {
  const { user } = useAuth();
  const { episodes } = useOperations();
  const { connections, jobs, saveJob, persistenceMode } = usePlatforms();
  const [message, setMessage] = useState<string | null>(null);

  async function approve(job: DistributionJobRecord) {
    if (!user) return;
    const decision = canApproveDistributionJob(
      job,
      episodes.find(item => item.id === job.episodeId),
      connections.find(item => item.platform === job.platform),
      user.role,
    );
    if (!decision.allowed) {
      setMessage(decision.blockers.join(' '));
      return;
    }
    await saveJob({ ...job, status: 'Approved', approvedByUid: user.uid });
    setMessage(`${job.platform} job approved.`);
  }

  async function executeTest(job: DistributionJobRecord) {
    if (persistenceMode !== 'Local demo') {
      setMessage('Browser test execution is disabled when Firestore is active. Production actions must run through the trusted server adapter.');
      return;
    }
    const connection = connections.find(item => item.platform === job.platform);
    const decision = canExecuteDistributionJob(job, connection);
    if (!decision.allowed) {
      setMessage(decision.blockers.join(' '));
      return;
    }
    if (!connection?.testMode) {
      setMessage('Production execution requires the trusted server adapter. Enable test mode only for a no-network simulation.');
      return;
    }
    const updated: DistributionJobRecord = {
      ...job,
      status: 'Succeeded',
      attempts: job.attempts + 1,
      lastAttemptAt: new Date().toISOString(),
      externalId: `test-${job.platform.toLowerCase()}-${crypto.randomUUID()}`,
      returnedVisibility: job.action === 'Upload Video' ? 'private' : undefined,
    };
    await saveJob(updated);
    setMessage(`${job.platform} test job completed. No external request was sent.`);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Distribution Control</h1><p className="mt-2 text-[#1B1734]/60">Approval-gated, retryable platform jobs with explicit returned-state verification.</p></div><span className="rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8">{persistenceMode}</span></div>
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    <div className="mt-7 space-y-4">{jobs.map(job => {
      const connection = connections.find(item => item.platform === job.platform);
      const returned = verifyReturnedState(job);
      return <article key={job.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{job.platform}</span><span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold">{job.action}</span><span className="rounded-full bg-[#1B1734] px-3 py-1 text-xs font-semibold text-white">{job.status}</span></div><h2 className="mt-4 font-serif text-2xl">{job.id}</h2><p className="mt-2 text-sm text-[#1B1734]/50">Episode {job.episodeId} · attempts {job.attempts}/5 · key {job.idempotencyKey}</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => void approve(job)} disabled={job.status !== 'Draft' && job.status !== 'Waiting Approval'} className="rounded-full border border-[#1B1734]/15 px-4 py-2.5 text-sm font-semibold disabled:opacity-40">Approve</button><button onClick={() => void executeTest(job)} disabled={job.status !== 'Approved'} className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"><Send size={16}/>Execute test</button></div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3"><State label="Connection" value={connection?.testMode ? 'Test mode' : connection?.state ?? 'Missing'} icon={connection?.state === 'Connected' || connection?.testMode ? CheckCircle2 : AlertTriangle}/><State label="Schedule" value={job.scheduledAt ? new Date(job.scheduledAt).toLocaleString() : 'Not scheduled'} icon={Clock3}/><State label="Returned state" value={returned.allowed ? `Verified · ${job.externalId}` : returned.blockers.join(' ')} icon={returned.allowed ? CheckCircle2 : AlertTriangle}/></div>
      </article>;
    })}</div>
    <section className="mt-6 rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Publication truth rule</h2><p className="mt-3 max-w-4xl leading-7 text-white/65">A successful API request is not proof that content is public. Each job stores the returned external ID, visibility or lifecycle state, attempts and errors. The operating record is updated only from the platform response.</p></section>
  </AppShell>;
}

function State({ label, value, icon: Icon }: { label: string; value: string; icon: typeof CheckCircle2 }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#8B2C6F]"><Icon size={15}/>{label}</div><p className="mt-2 text-xs leading-5 text-[#1B1734]/60">{value}</p></div>;
}
