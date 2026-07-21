import { AlertTriangle, CalendarDays, FileText, PlayCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export default function PublicEpisodeDetail() {
  const { slug } = useParams();
  const { episodes } = usePublicContent();
  const episode = episodes.find(item => item.slug === slug);

  if (!episode) return <PublicPageShell><SEO title="Episode not found" description="The requested approved MAJESTIC Muse episode was not found." canonicalPath={`/episodes/${slug ?? ''}`}/><section className="mx-auto max-w-4xl px-5 py-24 text-center"><h1 className="font-serif text-5xl">Episode not found</h1><p className="mt-4 text-[#1B1734]/60">This episode may still be private, Proposed, archived, or awaiting public approval.</p><Link to="/episodes" className="mt-7 inline-block rounded-full bg-[#1B1734] px-5 py-3 text-white">Return to episodes</Link></section></PublicPageShell>;

  const description = episode.summary;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': episode.videoUrl ? 'VideoObject' : 'PodcastEpisode',
    name: episode.title,
    description,
    datePublished: episode.status === 'Published' ? episode.releaseAt : undefined,
    partOfSeries: { '@type': 'PodcastSeries', name: 'MAJESTIC Muse Podcast by Marchette' },
    url: `https://MAJESTICMuseMedia.ai/episodes/${episode.slug}`,
  };

  return <PublicPageShell>
    <SEO title={episode.title} description={description} canonicalPath={`/episodes/${episode.slug}`} imageUrl={episode.imageUrl} jsonLd={jsonLd}/>
    <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#D8A7B1]">{episode.code}</span><span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-bold text-[#1B1734]">{episode.status}</span></div><h1 className="mt-5 font-serif text-5xl md:text-7xl">{episode.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">{episode.summary}</p><div className="mt-6 flex flex-wrap gap-5 text-sm text-white/55">{episode.releaseAt && <span className="inline-flex items-center gap-2"><CalendarDays size={16}/>{new Date(episode.releaseAt).toLocaleString()}</span>}<span>{episode.theme}</span></div></div></section>
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 lg:grid-cols-[1.35fr_.65fr] md:px-10">
      <div className="space-y-6"><article className="aspect-video rounded-[2rem] bg-[#1B1734] p-6 text-white"><div className="flex h-full flex-col items-center justify-center text-center">{episode.videoUrl ? <a href={episode.videoUrl} className="rounded-full bg-[#C9A227] px-5 py-3 font-semibold text-[#1B1734]">Watch approved video</a> : <><PlayCircle size={52} className="text-[#D8A7B1]"/><h2 className="mt-4 font-serif text-3xl">Public media pending approval</h2><p className="mt-3 max-w-xl text-white/55">A video player will appear only after the final master, rights, metadata, platform URL, and executive release approval are verified.</p></>}</div></article>
        <article className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-3xl">Episode notes</h2><p className="mt-4 leading-7 text-[#1B1734]/60">Guest: {episode.guestNames.join(', ')}. Approved biography and external links remain unavailable unless supplied through signed guest materials.</p><div className="mt-6 rounded-2xl bg-[#F8F4EC] p-4"><p className="flex items-center gap-2 text-sm font-semibold"><FileText size={17}/>Transcript: {episode.transcriptStatus}</p></div></article>
      </div>
      <aside className="space-y-5"><article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Continue the journey</h2><p className="mt-3 text-sm leading-6 text-[#1B1734]/60">{episode.ctaLabel}</p><Link to={episode.ctaUrl} className="mt-5 block rounded-full bg-[#8B2C6F] px-5 py-3 text-center font-semibold text-white">Join now</Link></article><article className="rounded-[2rem] bg-amber-50 p-6 text-amber-950"><h2 className="flex items-center gap-2 font-serif text-2xl"><AlertTriangle size={20}/>Truth note</h2><p className="mt-3 text-sm leading-6">Source: {episode.sourceReference}. No unverified sponsor, performance, release, transcript, rights, or platform claim is shown.</p></article></aside>
    </section>
  </PublicPageShell>;
}
