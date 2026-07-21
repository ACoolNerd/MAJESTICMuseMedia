import { Link } from 'react-router-dom';
export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#C9A227' }}>Together</p>
      <h1 className="text-4xl font-bold mb-6" style={{ color: '#F8F4EC' }}>Community</h1>
      <p className="text-lg mb-10" style={{ color: '#D8A7B1' }}>
        Join a community of women walking in faith, purpose, and identity. This is more than a podcast — it's a movement.
      </p>
      <div className="grid sm:grid-cols-2 gap-6 text-left mb-10">
        {[
          { title: 'Submit Your Story', desc: 'Share a moment where faith met purpose in your life.', href: '/submit-your-story' },
          { title: 'Be a Guest', desc: 'Apply to join Marchette for a conversation on the show.', href: '/be-a-guest' },
          { title: 'Newsletter', desc: 'Stay connected with updates, reflections, and announcements.', href: '/newsletter' },
          { title: 'Community Guidelines', desc: 'How we show up for each other in this space.', href: '/community-guidelines' },
        ].map((item) => (
          <Link key={item.href} to={item.href} className="rounded-2xl p-6 block hover:border-[#8B2C6F] transition-colors" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F22' }}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>{item.title}</h2>
            <p className="text-sm" style={{ color: '#D8A7B1' }}>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
