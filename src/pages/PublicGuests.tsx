import { UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPageShell } from '../components/PublicPageShell';
import { SEO } from '../components/SEO';
import { usePublicContent } from '../features/public/PublicContentContext';

export default function PublicGuests() {
  const { guests } = usePublicContent();
  return <PublicPageShell>
    <SEO title="Guests" description="Meet the approved guests featured on MAJESTIC Muse Podcast by Marchette." canonicalPath="/guests"/>
    <section className="bg-[#1B1734] px-5 py-20 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#C9A227]">Guest Directory</p><h1 className="mt-4 max-w-4xl font-serif text-5xl md:text-7xl">People with a story worth hearing.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">Only approved names, biographies, titles, photographs, and links appear publicly.</p></div></section>
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-10"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{guests.map(guest => <article key={guest.id} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#8B2C6F]/10 text-[#8B2C6F]">{guest.imageUrl ? <img src={guest.imageUrl} alt="" className="h-full w-full object-cover"/> : <UserRound size={38}/>}</div><h2 className="mt-5 font-serif text-3xl">{guest.name}</h2><p className="mt-2 text-sm font-semibold text-[#8B2C6F]">{guest.approvedTitle ?? 'Guest profile pending approval'}</p><p className="mt-3 line-clamp-4 text-sm leading-6 text-[#1B1734]/60">{guest.approvedBio ?? 'An approved public biography has not yet been supplied.'}</p><Link to={`/guests/${guest.slug}`} className="mt-5 inline-block font-semibold text-[#8B2C6F]">View guest profile →</Link></article>)}</div></section>
  </PublicPageShell>;
}
