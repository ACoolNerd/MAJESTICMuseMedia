import { useParams, Link } from 'react-router-dom';
import { seedGuests, seedEpisodes } from '../../lib/seed-data';
import { STATUS_LABELS } from '../../lib/utils';

export default function GuestPage() {
  const { slug } = useParams<{ slug: string }>();
  const guest = seedGuests.find((g) => g.slug === slug);

  if (!guest || !guest.isPublic) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Guest Not Found</h1>
        <p className="mb-6" style={{ color: '#D8A7B1' }}>This guest profile is not available.</p>
        <Link to="/guests" style={{ color: '#C9A227' }}>← Back to Guests</Link>
      </div>
    );
  }

  const guestEpisodes = seedEpisodes.filter((ep) =>
    guest.episodeIds.includes(ep.id) && ep.status !== 'proposed'
  );

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/guests" className="text-sm hover:underline mb-8 inline-block" style={{ color: '#C9A227' }}>← Back to Guests</Link>
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B2C6F33' }}>
          <span className="text-4xl font-bold" style={{ color: '#C9A227' }}>{guest.name[0]}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#F8F4EC' }}>{guest.name}</h1>
          <div className="flex flex-wrap gap-1 mt-2">
            {guest.topics.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#8B2C6F22', color: '#D8A7B1' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      {guest.bio && <p className="text-lg leading-relaxed mb-8" style={{ color: '#D8A7B1' }}>{guest.bio}</p>}
      {guestEpisodes.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Episodes</h2>
          <ul className="space-y-3">
            {guestEpisodes.map((ep) => (
              <li key={ep.id} className="rounded-xl p-4" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
                <p className="text-xs mb-1" style={{ color: '#D8A7B1' }}>{ep.seriesNumber} · {STATUS_LABELS[ep.status]}</p>
                <Link to={`/episodes/${ep.slug}`} className="font-semibold hover:underline" style={{ color: '#F8F4EC' }}>{ep.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
