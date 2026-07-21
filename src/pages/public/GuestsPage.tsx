import { seedGuests } from '../../lib/seed-data';
import { GUEST_STATUS_LABELS } from '../../lib/utils';

export default function GuestsPage() {
  const publicGuests = seedGuests.filter((g) => g.isPublic);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Voices</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Our Guests</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#D8A7B1' }}>
          Each guest brings a unique story of faith, purpose, and identity. These are the voices shaping the MAJESTIC Muse conversation.
        </p>
      </header>

      {publicGuests.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-semibold mb-2" style={{ color: '#F8F4EC' }}>Guest profiles coming soon</p>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>Guest spotlights will be published as episodes are released.</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {publicGuests.map((guest) => (
            <li key={guest.id}>
              <article className="rounded-2xl p-6 h-full" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
                <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: '#8B2C6F33' }}>
                  <span className="text-2xl font-bold" style={{ color: '#C9A227' }}>{guest.name[0]}</span>
                </div>
                <h2 className="text-xl font-bold mb-1" style={{ color: '#F8F4EC' }}>{guest.name}</h2>
                <p className="text-xs mb-3" style={{ color: '#C9A227' }}>{GUEST_STATUS_LABELS[guest.status]}</p>
                {guest.bio && <p className="text-sm leading-relaxed" style={{ color: '#D8A7B1' }}>{guest.bio}</p>}
                <div className="flex flex-wrap gap-1 mt-4">
                  {guest.topics.map((topic) => (
                    <span key={topic} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#8B2C6F22', color: '#D8A7B1' }}>{topic}</span>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
