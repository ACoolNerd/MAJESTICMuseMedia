import { Database, FileVideo2, HardDrive, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useMedia } from '../features/media/MediaContext';

function bytes(value: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let amount = value;
  let index = 0;
  while (amount >= 1024 && index < units.length - 1) { amount /= 1024; index += 1; }
  return `${amount.toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

export default function Media() {
  const { assets, loading, error, persistenceMode } = useMedia();
  if (loading) return <AppShell><p>Loading media evidence…</p></AppShell>;

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Media Library</h1><p className="mt-2 text-[#1B1734]/60">Metadata, checksums, backups, versions and approved derivatives—without storing large media in Firestore.</p></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs shadow-sm ring-1 ring-[#1B1734]/8"><Database size={15}/>{persistenceMode}</span></div>
    {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Using safe seed metadata because persistence returned: {error}</p>}
    <div className="mt-7 grid gap-5 xl:grid-cols-3">{assets.map(asset => <article key={asset.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
      <div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B2C6F]/10 text-[#8B2C6F]"><FileVideo2/></span><span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-[11px] font-bold">{asset.status}</span></div>
      <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{asset.kind}</p><h2 className="mt-2 break-all font-semibold">{asset.name}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs"><Metric label="Size" value={bytes(asset.sizeBytes)}/><Metric label="Duration" value={asset.durationSeconds ? `${Math.round(asset.durationSeconds / 60)} min` : 'N/A'}/><Metric label="Dimensions" value={asset.width ? `${asset.width}×${asset.height}` : 'N/A'}/><Metric label="Checksum" value={asset.checksum ? 'Recorded' : 'Missing'}/></div>
      <div className={`mt-4 flex items-center gap-2 rounded-2xl p-3 text-xs font-semibold ${asset.backupVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{asset.backupVerified ? <ShieldCheck size={16}/> : <HardDrive size={16}/>}Backup {asset.backupVerified ? 'verified' : 'not verified'}</div>
      <p className="mt-4 break-all text-[11px] leading-5 text-[#1B1734]/45">Storage reference: {asset.storagePath ?? 'Connection required'}</p>
    </article>)}</div>
    <section className="mt-6 rounded-[2rem] bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Large-file boundary</h2><p className="mt-3 max-w-4xl leading-7 text-white/65">This library stores evidence and references only. Production uploads must use signed Cloud Storage URLs, validate file type and size, calculate a checksum, verify backup completion and then create the metadata record.</p></section>
  </AppShell>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-3"><p className="text-[#1B1734]/45">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
