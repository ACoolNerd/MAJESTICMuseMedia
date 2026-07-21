import { Link, useNavigate } from 'react-router-dom';
import EpisodeCard from '../../features/episodes/EpisodeCard';
import { seedEpisodes } from '../../lib/seed-data';

export default function HomePage() {
  const navigate = useNavigate();
  const featuredEpisodes = seedEpisodes.filter((episode) => episode.status === 'confirmed');

  return (
    <div>
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24" aria-label="Hero" style={{ background: 'linear-gradient(180deg, #1B1734 0%, #2D1A4A 50%, #1B1734 100%)' }}>
        <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-6" style={{ color: '#8B2C6F' }}>
          MAJESTIC Muse Podcast by Marchette
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8 max-w-4xl" style={{ color: '#F8F4EC' }}>
          Where Faith, <span style={{ color: '#C9A227' }}>Purpose,</span> and Identity Find Their <span style={{ color: '#D8A7B1' }}>Voice.</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: '#D8A7B1' }}>
          Intimate conversations at the intersection of faith, identity, and purpose — for women who are becoming who they were always meant to be.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/episodes" className="px-8 py-4 rounded-lg font-semibold text-base transition-opacity hover:opacity-80" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
            Listen Now
          </Link>
          <Link to="/newsletter" className="px-8 py-4 rounded-lg font-semibold text-base transition-opacity hover:opacity-80" style={{ border: '1px solid #C9A227', color: '#C9A227' }}>
            Join the Community
          </Link>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-2xl" style={{ color: '#C9A22744' }} aria-hidden="true">
          ↓
        </div>
      </section>

      <section className="py-24 px-6" aria-labelledby="mission-heading" style={{ backgroundColor: '#13102A' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#8B2C6F' }}>
            Our Mission
          </p>
          <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#F8F4EC' }}>
            A Sanctuary for the Journey
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#D8A7B1' }}>
            MAJESTIC Muse is a podcast and community for women navigating the sacred tension between who they are and who God is calling them to become. Each episode is honest, unfiltered, and full of grace.
          </p>
        </div>
      </section>

      {featuredEpisodes.length > 0 && (
        <section className="py-24 px-6" aria-labelledby="episodes-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#8B2C6F' }}>
                Season 1
              </p>
              <h2 id="episodes-heading" className="text-3xl font-bold" style={{ color: '#F8F4EC' }}>
                Coming Soon
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featuredEpisodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} onClick={() => navigate(`/episodes/${episode.slug}`)} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/episodes" className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ border: '1px solid #C9A227', color: '#C9A227' }}>
                View All Episodes
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-6 text-center" aria-labelledby="guest-cta-heading" style={{ background: 'linear-gradient(135deg, #8B2C6F22 0%, #1B1734 50%, #C9A22711 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 id="guest-cta-heading" className="text-3xl font-bold mb-4" style={{ color: '#F8F4EC' }}>
            Your Story Deserves to Be Heard
          </h2>
          <p className="text-base mb-8" style={{ color: '#D8A7B1' }}>
            If God is doing something beautiful in your life — through the fire, through the stillness, through the becoming — we want to hear it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/be-a-guest" className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ backgroundColor: '#8B2C6F', color: '#F8F4EC' }}>
              Apply to Be a Guest
            </Link>
            <Link to="/submit-your-story" className="px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80" style={{ border: '1px solid #D8A7B1', color: '#D8A7B1' }}>
              Submit Your Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
