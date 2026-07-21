import { Link } from 'react-router-dom';
import { seedEpisodes, seedGuests } from '../../lib/seed-data';
import { formatDate, STAGE_LABELS, STATUS_LABELS } from '../../lib/utils';
import Badge, { statusVariant } from '../../components/ui/Badge';

export default function EpisodesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>
          MAJESTIC Muse Podcast
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#F8F4EC' }}>
          Episodes
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D8A7B1' }}>
          Every episode is an invitation — to see yourself, to remember your worth, and to walk more
          fully into who you were created to be.
        </p>
      </header>

      <ul className="space-y-6" role="list" aria-label="Episode list">
        {seedEpisodes.map((episode) => {
          const guests = seedGuests.filter(
            (g) => episode.guestIds.includes(g.id) && g.isPublic
          );
          const isClickable = episode.status === 'confirmed';

          return (
            <li key={episode.id}>
              <article
                className="rounded-2xl p-6 sm:p-8 grid sm:grid-cols-[auto_1fr] gap-6"
                style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}
              >
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2A1040, #1B1734)' }}
                  aria-hidden="true"
                >
                  <span className="text-2xl font-bold" style={{ color: '#C9A22755' }}>
                    {episode.seriesNumber.slice(-2)}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge variant={statusVariant[episode.status]}>
                      {STATUS_LABELS[episode.status]}
                    </Badge>
                    <span className="text-xs" style={{ color: '#D8A7B1' }}>
                      {episode.seriesNumber}
                    </span>
                    <span className="text-xs" style={{ color: '#D8A7B1' }}>
                      {STAGE_LABELS[episode.stage]}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3" style={{ color: '#F8F4EC' }}>
                    {isClickable ? (
                      <Link
                        to={`/episodes/${episode.slug}`}
                        className="hover:text-[#C9A227] transition-colors"
                      >
                        {episode.title}
                      </Link>
                    ) : (
                      episode.title
                    )}
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#D8A7B1' }}>
                    {episode.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#D8A7B1' }}>
                    {episode.releaseDate && (
                      <span>Release: {formatDate(episode.releaseDate)}</span>
                    )}
                    {guests.length > 0 && (
                      <span>Guest: {guests.map((g) => g.name).join(', ')}</span>
                    )}
                    {episode.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#8B2C6F22', color: '#D8A7B1' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
