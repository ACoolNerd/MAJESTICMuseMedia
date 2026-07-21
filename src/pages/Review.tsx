import { useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, Clock3, MessageSquareText } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { useMedia } from '../features/media/MediaContext';
import { commentsToRevisionList, formatTimecode } from '../features/media/workflow';
import type { CommentCategory, CommentSeverity, TimecodedCommentRecord } from '../features/media/types';

const categories: CommentCategory[] = ['Story','Remove','Shorten','Fact check','Rights concern','Audio','Color','Graphic','Caption','Brand','CTA','Clip candidate'];
const severities: CommentSeverity[] = ['Note','Important','Blocking'];

export default function Review() {
  const { user } = useAuth();
  const { versions, comments, saveComment, persistenceMode } = useMedia();
  const [versionId, setVersionId] = useState(versions[0]?.id ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const versionComments = useMemo(() => comments.filter(comment => comment.versionId === versionId), [comments, versionId]);
  const revisions = commentsToRevisionList(versionComments);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !versionId) return;
    const data = new FormData(event.currentTarget);
    const timeSeconds = Number(data.get('timeSeconds'));
    const body = String(data.get('body') ?? '').trim();
    if (!Number.isFinite(timeSeconds) || timeSeconds < 0 || body.length < 3) {
      setMessage('Enter a valid time and review note.');
      return;
    }
    const record: TimecodedCommentRecord = {
      id: crypto.randomUUID(), versionId, episodeId: versions.find(item => item.id === versionId)?.episodeId ?? '',
      authorUid: user.uid, authorName: user.displayName, timeSeconds,
      category: String(data.get('category')) as CommentCategory,
      severity: String(data.get('severity')) as CommentSeverity,
      body, resolved: false, createdAt: new Date().toISOString(),
    };
    await saveComment(record);
    event.currentTarget.reset();
    setMessage(`Comment added at ${formatTimecode(timeSeconds)}.`);
  }

  async function toggleResolved(comment: TimecodedCommentRecord) {
    await saveComment({ ...comment, resolved: !comment.resolved, resolvedAt: !comment.resolved ? new Date().toISOString() : undefined });
  }

  return <AppShell>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="font-serif text-4xl">Media Review</h1><p className="mt-2 text-[#1B1734]/60">One versioned, time-coded conversation instead of scattered notes.</p></div><select value={versionId} onChange={event => setVersionId(event.target.value)} className="rounded-full border border-[#1B1734]/15 bg-white px-4 py-2 text-sm">{versions.map(version => <option key={version.id} value={version.id}>{version.label} · {version.status}</option>)}</select></div>
    {message && <p role="status" className="mt-5 rounded-2xl bg-[#8B2C6F]/10 p-4 text-sm text-[#8B2C6F]">{message}</p>}
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5">
        <div className="aspect-video rounded-3xl bg-[#1B1734] p-6 text-white"><div className="flex h-full flex-col items-center justify-center text-center"><MessageSquareText className="text-[#D8A7B1]" size={48}/><h2 className="mt-4 font-serif text-3xl">Review player boundary</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/60">Connect an approved signed review URL to enable playback, pause-to-comment and visual annotation. No private media URL is embedded in source code.</p></div></div>
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-[130px_1fr_1fr]">
          <label className="text-xs font-semibold">Seconds<input name="timeSeconds" type="number" min="0" step="1" required className="mt-2 w-full rounded-xl border border-[#1B1734]/15 px-3 py-2"/></label>
          <label className="text-xs font-semibold">Category<select name="category" className="mt-2 w-full rounded-xl border border-[#1B1734]/15 px-3 py-2">{categories.map(category => <option key={category}>{category}</option>)}</select></label>
          <label className="text-xs font-semibold">Severity<select name="severity" className="mt-2 w-full rounded-xl border border-[#1B1734]/15 px-3 py-2">{severities.map(severity => <option key={severity}>{severity}</option>)}</select></label>
          <label className="text-xs font-semibold md:col-span-3">Review note<textarea name="body" required rows={3} className="mt-2 w-full rounded-xl border border-[#1B1734]/15 px-3 py-2"/></label>
          <button className="rounded-full bg-[#8B2C6F] px-5 py-3 text-sm font-semibold text-white md:col-span-3">Add time-coded comment</button>
        </form>
      </section>
      <aside className="space-y-5">
        <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Comments</h2><span className="text-xs text-[#1B1734]/45">{persistenceMode}</span></div><div className="mt-4 space-y-3">{versionComments.map(comment => <article key={comment.id} className={`rounded-2xl border p-4 ${comment.resolved ? 'border-green-200 bg-green-50/50' : 'border-[#1B1734]/8'}`}><div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1 text-xs font-bold text-[#8B2C6F]"><Clock3 size={13}/>{formatTimecode(comment.timeSeconds)}</span><span className="text-[10px] font-bold uppercase tracking-wide">{comment.severity}</span></div><p className="mt-2 text-xs font-semibold">{comment.category}</p><p className="mt-2 text-sm leading-6 text-[#1B1734]/65">{comment.body}</p><button onClick={() => void toggleResolved(comment)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#8B2C6F]"><CheckCircle2 size={14}/>{comment.resolved ? 'Reopen' : 'Resolve'}</button></article>)}</div></section>
        <section className="rounded-[2rem] bg-[#1B1734] p-5 text-white"><h2 className="font-serif text-2xl">Revision list</h2><ol className="mt-4 space-y-3 text-xs leading-5 text-white/65">{revisions.map(item => <li key={item}>{item}</li>)}</ol></section>
      </aside>
    </div>
  </AppShell>;
}
