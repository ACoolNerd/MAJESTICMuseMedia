import { Link } from 'react-router-dom';
export default function WorkWithUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#C9A227' }}>Partnership</p>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#F8F4EC' }}>Work With Us</h1>
        <p className="text-lg" style={{ color: '#D8A7B1' }}>Partner with MAJESTIC Muse to reach an audience of intentional, faith-led women.</p>
      </header>
      <div className="grid sm:grid-cols-2 gap-6">
        {[
          { title: 'Sponsorship', desc: 'Align your brand with our mission and reach our engaged audience.', href: '/partners' },
          { title: 'Speaking Engagements', desc: 'Bring Marchette\'s voice to your event or platform.', href: '/partners' },
          { title: 'Media Partnerships', desc: 'Collaborate on content, cross-promotions, and more.', href: '/partners' },
          { title: 'Be a Guest', desc: 'Apply to share your story on the podcast.', href: '/be-a-guest' },
        ].map((item) => (
          <Link key={item.title} to={item.href} className="rounded-2xl p-8 block hover:opacity-90 transition-opacity" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F33' }}>
            <h2 className="text-xl font-bold mb-3" style={{ color: '#F8F4EC' }}>{item.title}</h2>
            <p style={{ color: '#D8A7B1' }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
