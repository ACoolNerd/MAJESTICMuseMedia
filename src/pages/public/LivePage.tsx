export default function LivePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#C9A227' }}>Live Events</p>
      <h1 className="text-4xl font-bold mb-6" style={{ color: '#F8F4EC' }}>Join Us Live</h1>
      <p className="text-lg mb-10" style={{ color: '#D8A7B1' }}>
        MAJESTIC Muse Live is coming soon. Follow us to be notified when we go live.
      </p>
      <div className="rounded-2xl p-10" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F33' }}>
        <p className="text-2xl mb-2" aria-hidden="true">◌</p>
        <p className="font-semibold mb-2" style={{ color: '#F8F4EC' }}>No live events scheduled</p>
        <p className="text-sm" style={{ color: '#D8A7B1' }}>Check back soon for upcoming livestreams and special events.</p>
      </div>
    </div>
  );
}
