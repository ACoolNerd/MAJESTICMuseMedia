import { useMemo, useState } from 'react';
import { Download, FileText, Scissors, ShieldAlert } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useMedia } from '../features/media/MediaContext';
import { generateCapCutPacket } from '../features/media/workflow';
import { useOperations } from '../features/operations/OperationsContext';

function downloadText(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function CapCut() {
  const { episodes } = useOperations();
  const { assets, comments } = useMedia();
  const [episodeId, setEpisodeId] = useState(episodes[0]?.id ?? '');
  const episode = episodes.find(item => item.id === episodeId) ?? episodes[0];
  const packet = useMemo(() => episode ? generateCapCutPacket(episode, assets, comments) : null, [assets, comments, episode]);

  if (!episode || !packet) return <AppShell><p>No episode is available for packet generation.</p></AppShell>;

  function downloadPacket() {
    downloadText(`${episode.code}_CAPCUT_PACKET.json`, JSON.stringify(packet, null, 2));
  }

  function downloadClipCsv() {
    const header = 'id,start_seconds,end_seconds,platform,aspect_ratio,hook,cta';
    const rows = packet.clipCandidates.map(clip => [clip.id, clip.startSeconds, clip.endSeconds, clip.platform, clip.aspectRatio, clip.hook, clip.cta].map(value => `"${String(value).replaceAll('"', '""')}"`).join(','));
    downloadText(`${episode.code}_CLIP_CANDIDATES.csv`, [header, ...rows].join('\n'), 'text/csv');
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">CapCut Handoff Center</h1><p className="mt-2 text-[#1B1734]/60">Generate a dependable edit packet, then return the review export and final master to the operating system.</p></div><select value={episode.id} onChange={event => setEpisodeId(event.target.value)} className="rounded-full border border-[#1B1734]/15 bg-white px-4 py-2 text-sm">{episodes.map(item => <option key={item.id} value={item.id}>{item.code} · {item.title}</option>)}</select></div>

    <section className="mt-7 rounded-[2rem] bg-[#1B1734] p-6 text-white"><div className="flex items-start gap-4"><ShieldAlert className="mt-1 shrink-0 text-[#C9A227]"/><div><h2 className="font-serif text-2xl">Controlled handoff—not unsupported automation</h2><p className="mt-2 max-w-4xl leading-7 text-white/65">This workspace does not claim to control CapCut directly. It produces structured instructions, captions, clip selections, file names and export requirements for the editor. Finished exports return here for validation and approval.</p></div></div></section>

    <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B2C6F]/10 text-[#8B2C6F]"><Scissors/></span><div><p className="text-xs font-bold uppercase tracking-widest text-[#8B2C6F]">{episode.code}</p><h2 className="font-serif text-2xl">{packet.sequenceName}</h2></div></div>
        <div className="mt-6 grid gap-4 md:grid-cols-2"><Metric label="Transcript" value={packet.transcriptStatus}/><Metric label="Captions" value={packet.captionStatus}/><Metric label="Source assets" value={String(packet.sourceAssets.length)}/><Metric label="Clip candidates" value={String(packet.clipCandidates.length)}/></div>
        <h3 className="mt-7 font-serif text-2xl">Story outline</h3><ol className="mt-4 space-y-3">{packet.storyOutline.map((item, index) => <li key={item} className="flex gap-3 rounded-2xl bg-[#F8F4EC] p-4"><span className="font-bold text-[#8B2C6F]">{index + 1}</span><span>{item}</span></li>)}</ol>
        <h3 className="mt-7 font-serif text-2xl">Export presets</h3><div className="mt-4 grid gap-3 md:grid-cols-2">{packet.exportPresets.map(preset => <div key={preset.name} className="rounded-2xl border border-[#1B1734]/8 p-4"><p className="font-semibold">{preset.name}</p><p className="mt-2 text-xs text-[#1B1734]/55">{preset.ratio} · {preset.resolution} · {preset.codec}</p></div>)}</div>
      </section>
      <aside className="space-y-5"><section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Downloads</h2><button onClick={downloadPacket} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-[#8B2C6F] px-4 py-3 text-sm font-semibold text-white"><span className="inline-flex items-center gap-2"><FileText size={17}/>CapCut packet JSON</span><Download size={17}/></button><button onClick={downloadClipCsv} className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[#1B1734]/15 px-4 py-3 text-sm font-semibold"><span className="inline-flex items-center gap-2"><FileText size={17}/>Clip candidate CSV</span><Download size={17}/></button><p className="mt-4 text-xs leading-5 text-[#1B1734]/50">File pattern: {packet.fileNamingPattern}</p></section>
        <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Clip candidates</h2><div className="mt-4 space-y-3">{packet.clipCandidates.map(clip => <div key={clip.id} className="rounded-2xl bg-[#F8F4EC] p-4"><p className="text-xs font-bold text-[#8B2C6F]">{clip.platform} · {clip.aspectRatio}</p><p className="mt-2 text-sm font-semibold">{clip.hook}</p><p className="mt-2 text-xs text-[#1B1734]/50">{clip.startSeconds}s–{clip.endSeconds}s</p></div>)}</div></section>
      </aside>
    </div>
  </AppShell>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-[#F8F4EC] p-4"><p className="text-xs text-[#1B1734]/45">{label}</p><p className="mt-1 font-semibold">{value}</p></div>;
}
