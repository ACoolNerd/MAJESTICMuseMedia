import { useParams, Link } from 'react-router-dom';
import { seedEpisodes, seedGuests } from '../../lib/seed-data';
import { formatDate, STATUS_LABELS, STAGE_LABELS } from '../../lib/utils';
import Badge, { statusVariant } from '../../components/ui/Badge';
import ReleaseGateStatusComponent from '../../components/ui/ReleaseGateStatus';

export default function EpisodePage() {
  const { slug } = useParams<{ slug: string }>();
  const episode = seedEpisodes.find((ep) => ep.slug === slug);

  if (!episode) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Episode Not Found</h1>
        <p className="mb-6" style={{ color: '#D8A7B1' }}>
          The episode you're looking for doesn't exist or hasn't been published yet.
        </p>
        <Link to="/episodes" style={{ color: '#C9A227' }}>← Back to Episodes</Link>
      </div>
    );
  }

  if (episode.status === 'proposed') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <Badge variant="neutral" className="mb-6">Proposed</Badge>
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>{episode.title}</h1>
        <p className="mb-6" style={{ color: '#D8A7B1' }}>
          This episode is in early planning. Details will be available once confirmed.
        </p>
        <Link to="/episodes" style={{ color: '#C9A227' }}>← Back to Episodes</Link>
      </div>
    );
  }

  const publicGuests = seedGuests.filter((g) => episode.guestIds.includes(g.id) && g.isPublic);

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      <Link to="/episodes" className="text-sm hover:underline mb-8 inline-block" style={{ color: '#C9A227' }}>
        ← Back to Episodes
      </Link>

      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant={statusVariant[episode.status]}>{STATUS_LABELS[episode.status]}</Badge>
          <span className="text-sm" style={{ color: '#D8A7B1' }}>{episode.seriesNumber}</span>
          <span className="text-sm" style={{ color: '#D8A7B1' }}>{STAGE_LABELS[episode.stage]}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: '#F8F4EC' }}>
          {episode.title}
        </h1>
        <p className="text-xl leading-relaxed" style={{ color: '#D8A7B1' }}>
          {episode.description}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {episode.releaseDate && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>Release Date</h2>
              <p style={{ color: '#C9A227' }}>{formatDate(episode.releaseDate)}</p>
            </div>
          )}

          {publicGuests.length > 0 && (
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#F8F4EC' }}>Featured Guest{publicGuests.length > 1 ? 's' : ''}</h2>
              {publicGuests.map((guest) => (
                <div key={guest.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8B2C6F33' }}>
                    <span className="text-xl font-bold" style={{ color: '#C9A227' }}>{guest.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#F8F4EC' }}>{guest.name}</p>
                    {guest.bio && <p className="text-sm" style={{ color: '#D8A7B1' }}>{guest.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2" role="list" aria-label="Episode tags">
            {episode.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#8B2C6F22', color: '#D8A7B1' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl p-6 sticky top-6" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
            <h2 className="text-sm font-semibold mb-4 uppercase tracking-widest" style={{ color: '#C9A227' }}>Release Status</h2>
            <ReleaseGateStatusComponent gates={episode.releaseGates} />
          </div>
        </aside>
      </div>
    </article>
  );
}
