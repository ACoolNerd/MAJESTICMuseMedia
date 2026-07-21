import { AlertTriangle, CheckCircle2, FileCheck2, ShieldAlert } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useOperations } from '../features/operations/OperationsContext';
import type { RightsRecord } from '../features/operations/types';

const clearanceOptions = ['Not Applicable', 'Missing', 'Pending', 'Cleared'] as const;
const releaseOptions: RightsRecord['guestRelease'][] = ['Missing', 'Pending', 'Cleared'];
const sensitiveOptions: RightsRecord['sensitiveInformationReview'][] = ['Pending', 'Cleared', 'Blocked'];

function isCleared(record: RightsRecord): boolean {
  return record.guestRelease === 'Cleared' &&
    ['Not Applicable', 'Cleared'].includes(record.musicRights) &&
    ['Not Applicable', 'Cleared'].includes(record.imageRights) &&
    ['Not Applicable', 'Cleared'].includes(record.disclosureStatus) &&
    record.sensitiveInformationReview === 'Cleared';
}

export default function Rights() {
  const { rights, episodes, loading, saveRights } = useOperations();
  if (loading) return <AppShell><p>Loading rights records…</p></AppShell>;

  async function patch(record: RightsRecord, changes: Partial<RightsRecord>) {
    await saveRights({ ...record, ...changes });
  }

  return <AppShell>
    <div><h1 className="font-serif text-4xl">Rights and Release Register</h1><p className="mt-2 text-[#1B1734]/60">Guest releases, music, images, disclosures and sensitive-information review must be evidenced before release.</p></div>
    <section className="mt-7 grid gap-5 xl:grid-cols-2">{rights.map(record => {
      const episode = episodes.find(item => item.id === record.episodeId);
      const cleared = isCleared(record);
      return <article key={record.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{episode?.code ?? record.episodeId}</p><h2 className="mt-2 font-serif text-2xl">{episode?.title ?? 'Episode rights'}</h2></div>{cleared ? <CheckCircle2 className="text-green-700"/> : <ShieldAlert className="text-red-700"/>}</div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select label="Guest release" value={record.guestRelease} options={releaseOptions} onChange={value => void patch(record, { guestRelease: value as RightsRecord['guestRelease'] })}/>
          <Select label="Music rights" value={record.musicRights} options={clearanceOptions} onChange={value => void patch(record, { musicRights: value as RightsRecord['musicRights'] })}/>
          <Select label="Image rights" value={record.imageRights} options={clearanceOptions} onChange={value => void patch(record, { imageRights: value as RightsRecord['imageRights'] })}/>
          <Select label="Disclosure" value={record.disclosureStatus} options={clearanceOptions} onChange={value => void patch(record, { disclosureStatus: value as RightsRecord['disclosureStatus'] })}/>
          <Select label="Sensitive-information review" value={record.sensitiveInformationReview} options={sensitiveOptions} onChange={value => void patch(record, { sensitiveInformationReview: value as RightsRecord['sensitiveInformationReview'] })}/>
          <div className="rounded-2xl bg-[#F8F4EC] p-4"><p className="text-xs font-semibold">Evidence references</p><p className="mt-2 text-sm text-[#1B1734]/55">{record.evidenceReferences.length ? record.evidenceReferences.join(' · ') : 'No evidence recorded'}</p></div>
        </div>
        <p className={`mt-5 flex items-start gap-2 rounded-2xl p-4 text-sm ${cleared ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{cleared ? <FileCheck2 size={17} className="mt-0.5 shrink-0"/> : <AlertTriangle size={17} className="mt-0.5 shrink-0"/>}{cleared ? 'Rights record is fully cleared, subject to evidence verification.' : 'Release remains blocked until every required category is cleared or formally marked Not Applicable.'}</p>
      </article>;
    })}</section>
  </AppShell>;
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="text-xs font-semibold">{label}<select value={value} onChange={event => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 bg-white px-3 py-2 text-sm">{options.map(option => <option key={option}>{option}</option>)}</select></label>;
}
