import { AlertTriangle, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export default function PublicGuestDetail() {
  const { slug } = useParams();
  const { guests, episodes } = usePublicContent();
  const guest = guests.find(item => item.slug === slug);

  if (!guest) return <PublicPageShell><SEO title="Guest not found" description="The requested approved guest profile was not found." canonicalPath={`/guests/${slug ?? ''}`}/><section className="mx-auto max-w-4xl px-5 py-24 text-center"><h1 className="font-serif text-5xl">Guest profile not found</h1><p className="mt-4 text-[#1B1734]/60">The profile may still be private or awaiting signed guest materials.</p><Link to="/guests" className="mt-7 inline-block rounded-full bg-[#1B1734] px-5 py-3 text-white">Return to guests</Link></section></PublicPageShell>;

  const appearances = episodes.filter(episode => guest.episodeIds.includes(episode.id));
  return <PublicPageShell>
    <SEO title={guest.name} description={guest.approvedBio ?? `${guest.name} is an upcoming guest on MAJESTIC Muse Podcast by Marchette.`} canonicalPath={`/guests/${guest.slug}`} imageUrl={guest.imageUrl}/>
    <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center"><div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-[#D8A7B1]">{guest.imageUrl ? <img src={guest.imageUrl} alt="" className="h-full w-full object-cover"/> : <UserRound size={64}/>}</div><div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#C9A227]">Guest Profile</p><h1 className="mt-3 font-serif text-5xl md:text-7xl">{guest.name}</h1><p className="mt-3 text-lg text-white/65">{guest.approvedTitle ?? 'Approved title pending'}</p></div></div></section>
    <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 lg:grid-cols-[1.2fr_.8fr] md:px-10"><article className="rounded-[2rem] bg-white p-7 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-3xl">About</h2><p className="mt-4 leading-8 text-[#1B1734]/65">{guest.approvedBio ?? 'An approved public biography has not yet been supplied. MAJESTIC Muse does not fabricate guest credentials, organizations, achievements, or personal history.'}</p>{guest.websiteUrl && <a href={guest.websiteUrl} rel="noreferrer" className="mt-5 inline-block font-semibold text-[#8B2C6F]">Visit approved website →</a>}</article><aside className="space-y-5"><article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Appearances</h2><div className="mt-4 space-y-3">{appearances.map(episode => <Link key={episode.id} to={`/episodes/${episode.slug}`} className="block rounded-2xl bg-[#F8F4EC] p-4"><p className="text-xs font-bold text-[#8B2C6F]">{episode.code} · {episode.status}</p><p className="mt-1 font-semibold">{episode.title}</p></Link>)}</div></article><article className="rounded-[2rem] bg-amber-50 p-6 text-amber-950"><h2 className="flex items-center gap-2 font-serif text-2xl"><AlertTriangle size={20}/>Profile authority</h2><p className="mt-3 text-sm leading-6">Source: {guest.sourceReference}. Public details remain limited to approved guest materials.</p></article></aside></section>
  </PublicPageShell>;
}
