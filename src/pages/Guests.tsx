import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, UserRound } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { hasPermission } from '../features/auth/permissions';
import { useOperations } from '../features/operations/OperationsContext';
import type { GuestRecord } from '../features/operations/types';

const guestStatuses: GuestRecord['status'][] = ['Suggested','Researching','Invited','Confirmed','Recorded','Published','Declined','TBD'];
const releaseStatuses: GuestRecord['releaseStatus'][] = ['Missing','Sent','Signed','Waived with Written Reason'];

export default function Guests() {
  const { user } = useAuth();
  const { guests, saveGuest, persistenceMode } = useOperations();
  const [message, setMessage] = useState<string | null>(null);
  const canEdit = Boolean(user && hasPermission(user.role, 'guests.edit'));

  async function patch(guest: GuestRecord, changes: Partial<GuestRecord>) {
    await saveGuest({ ...guest, ...changes });
    setMessage(`${guest.name} was updated.`);
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Guest Pipeline</h1><p className="mt-2 text-[#1B1734]/60">Qualification, biography, headshot, release and promotional readiness.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={15}/>{persistenceMode}</span></div>
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    <div className="mt-7 grid gap-5 lg:grid-cols-2">{guests.map(guest => {
      const ready = guest.bioStatus === 'Approved' && guest.headshotStatus === 'Approved' && (guest.releaseStatus === 'Signed' || guest.releaseStatus === 'Waived with Written Reason');
      return <article key={guest.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="flex items-start justify-between gap-4"><div className="flex gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8B2C6F]/10 text-[#8B2C6F]"><UserRound/></span><div><h2 className="font-serif text-2xl">{guest.name}</h2><p className="mt-1 text-sm text-[#1B1734]/55">{guest.proposedTopic}</p></div></div>{ready ? <CheckCircle2 className="text-green-700"/> : <AlertTriangle className="text-amber-700"/>}</div>
        <p className="mt-4 rounded-2xl bg-[#F8F4EC] p-3 text-xs leading-5 text-[#1B1734]/55">Source: {guest.sourceReference}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><Status label="Bio" value={guest.bioStatus}/><Status label="Headshot" value={guest.headshotStatus}/><Status label="Release" value={guest.releaseStatus}/></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-semibold">Pipeline status<select disabled={!canEdit} value={guest.status} onChange={event => void patch(guest, { status: event.target.value as GuestRecord['status'] })} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{guestStatuses.map(status => <option key={status}>{status}</option>)}</select></label>
          <label className="text-xs font-semibold">Release status<select disabled={!canEdit} value={guest.releaseStatus} onChange={event => void patch(guest, { releaseStatus: event.target.value as GuestRecord['releaseStatus'] })} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{releaseStatuses.map(status => <option key={status}>{status}</option>)}</select></label>
        </div>
      </article>;
    })}</div>
  </AppShell>;
}

function Status({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[#1B1734]/8 p-3"><p className="text-[11px] text-[#1B1734]/45">{label}</p><p className="mt-1 text-xs font-semibold">{value}</p></div>;
}
