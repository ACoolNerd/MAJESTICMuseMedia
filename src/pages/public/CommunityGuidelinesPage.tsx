export default function CommunityGuidelinesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8" style={{ color: '#F8F4EC' }}>Community Guidelines</h1>
      <div className="space-y-6 text-base leading-relaxed" style={{ color: '#D8A7B1' }}>
        <p>MAJESTIC Muse is a space built on faith, dignity, and the deep belief that every woman's story matters. These guidelines exist to protect that sacred space.</p>
        {[
          { title: 'Lead with Love', text: 'Engage with kindness and grace, even when you disagree.' },
          { title: 'Honor Every Story', text: "Other people's stories are not yours to critique or minimize. Receive them with open hands." },
          { title: 'No Harassment', text: 'Harassment, discrimination, and hate speech of any kind will not be tolerated.' },
          { title: 'Protect Privacy', text: "Never share another person's personal information without their consent." },
          { title: 'Stay On Mission', text: 'This community is centered on faith, purpose, and identity. Keep conversations aligned with that mission.' },
        ].map((g) => (
          <section key={g.title}>
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#F8F4EC' }}>{g.title}</h2>
            <p>{g.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
