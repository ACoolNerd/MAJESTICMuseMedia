import { Link } from 'react-router-dom';
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Our Story</p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: '#F8F4EC' }}>About MAJESTIC Muse</h1>
      </header>

      <div className="space-y-10" style={{ color: '#D8A7B1' }}>
        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8F4EC' }}>The Vision</h2>
          <p className="text-lg leading-relaxed">
            MAJESTIC Muse is a podcast created by Marchette — a faith-led space where women come to
            hear stories that mirror their own. Where faith, purpose, and identity find their voice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8F4EC' }}>The Host</h2>
          <p className="text-lg leading-relaxed">
            Marchette is the CEO, Founder, and Executive Producer of MAJESTIC Muse Media. As the
            host of the MAJESTIC Muse Podcast, she creates space for authentic conversations about
            identity, purpose, and the kind of faith that moves mountains.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#F8F4EC' }}>The Name</h2>
          <p className="text-lg leading-relaxed">
            MAJESTIC — because every woman carries a majestic story worth telling. Muse — because
            inspiration lives inside each of us, waiting to be called out.
          </p>
        </section>

        <div className="flex flex-wrap gap-4 pt-4">
          <Link to="/be-a-guest" className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ backgroundColor: '#C9A227', color: '#1B1734' }}>
            Be a Guest
          </Link>
          <Link to="/work-with-us" className="px-6 py-3 rounded-xl text-sm font-semibold" style={{ border: '1px solid #8B2C6F', color: '#F8F4EC' }}>
            Work With Us
          </Link>
        </div>
      </div>
    </div>
  );
}
