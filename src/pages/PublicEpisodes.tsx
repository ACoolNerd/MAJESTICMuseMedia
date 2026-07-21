import { CalendarDays, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export default function PublicEpisodes() {
  const { episodes, loading, error, sourceMode } = usePublicContent();
  const published = episodes.filter(item => item.status === 'Published');
  const upcoming = episodes.filter(item => item.status === 'Upcoming');

  return <PublicPageShell>
    <SEO title="Episodes" description="Watch and explore approved MAJESTIC Muse conversations about identity, faith, purpose, family, leadership, creativity, and legacy." canonicalPath="/episodes"/>
    <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#C9A227]">Episode Library</p><h1 className="mt-4 max-w-4xl font-serif text-5xl md:text-7xl">Conversations that help purpose find its voice.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">Only approved public records appear here. Proposed episodes, private production notes, unapproved guest biographies, and unfinished media remain inside the control center.</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-10">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center"><h2 className="font-serif text-3xl">Published episodes</h2><span className="text-xs text-[#1B1734]/45">Source: {sourceMode}</span></div>
      {loading ? <p className="mt-6">Loading approved episodes…</p> : published.length ? <div className="mt-6 grid gap-5 md:grid-cols-2">{published.map(item => <EpisodeCard key={item.id} item={item}/>)}</div> : <div className="mt-6 rounded-[2rem] border border-[#1B1734]/10 bg-white p-8"><PlayCircle className="text-[#8B2C6F]" size={40}/><h3 className="mt-4 font-serif text-2xl">No episode has been verified as published yet.</h3><p className="mt-3 max-w-2xl leading-7 text-[#1B1734]/60">The first approved video, audio, transcript, chapters, and public platform URL will appear after all release gates pass.</p></div>}
      {error && <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">Public content service is unavailable, so the approved static fallback is displayed.</p>}
      <h2 className="mt-14 font-serif text-3xl">Upcoming</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{upcoming.map(item => <EpisodeCard key={item.id} item={item}/>)}</div>
    </section>
  </PublicPageShell>;
}

function EpisodeCard({ item }: { item: ReturnType<typeof usePublicContent>['episodes'][number] }) {
  return <article className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{item.code}</span><span className="rounded-full bg-[#F8F4EC] px-3 py-1 text-xs font-semibold">{item.status}</span></div><h3 className="mt-5 font-serif text-3xl">{item.title}</h3><p className="mt-3 leading-7 text-[#1B1734]/60">{item.summary}</p>{item.releaseAt && <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#1B1734]/50"><CalendarDays size={16}/>{new Date(item.releaseAt).toLocaleString()}</p>}<div className="mt-6"><Link to={`/episodes/${item.slug}`} className="font-semibold text-[#8B2C6F]">View episode details →</Link></div></article>;
}
