import { AlertTriangle, CalendarDays, Radio } from 'lucide-react';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export default function PublicLive() {
  const { live } = usePublicContent();
  return <PublicPageShell>
    <SEO title="Live" description="Watch verified MAJESTIC Muse livestreams and approved replays across connected platforms." canonicalPath="/live"/>
    <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto max-w-6xl"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B2C6F]"><Radio size={28}/></div><h1 className="mt-6 font-serif text-5xl md:text-7xl">MAJESTIC Muse Live</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">A single verified destination for live conversations, community questions, and approved replays.</p></div></section>
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-10"><article className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><span className="rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-bold text-[#8B2C6F]">{live.status}</span><h2 className="mt-5 font-serif text-4xl">{live.title}</h2><p className="mt-4 max-w-2xl leading-7 text-[#1B1734]/60">{live.description}</p></div>{live.startsAt && <p className="inline-flex h-fit items-center gap-2 rounded-2xl bg-[#F8F4EC] p-4 text-sm"><CalendarDays size={17}/>{new Date(live.startsAt).toLocaleString()}</p>}</div>{live.platformLinks.length ? <div className="mt-7 flex flex-wrap gap-3">{live.platformLinks.map(link => <a key={link.platform} href={link.url} rel="noreferrer" className="rounded-full bg-[#1B1734] px-5 py-3 font-semibold text-white">Watch on {link.platform}</a>)}</div> : <p className="mt-7 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900"><AlertTriangle size={17} className="mt-0.5 shrink-0"/>No platform URL is displayed until the event ID, public URL, embed, chat, rights, and release status are verified.</p>}</article></section>
  </PublicPageShell>;
}
