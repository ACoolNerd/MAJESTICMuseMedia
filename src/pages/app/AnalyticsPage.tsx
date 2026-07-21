import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';

export default function AnalyticsPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Intelligence"
        title="Analytics"
        description="A foundation for tracking reach, resonance, and conversion once public channels and forms are connected."
      />
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard label="North star" value="Resonance" note="The goal is meaningful engagement, not vanity metrics." />
        <StatCard label="Channel focus" value="Owned audience" note="Newsletter growth should be prioritized alongside platform discovery." />
        <StatCard label="Launch metric" value="Premiere watch rate" note="Debut live and replay completion will shape the next publishing moves." />
      </div>
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Reporting plan</h2>
        <p className="text-sm" style={{ color: '#D8A7B1' }}>
          Once integrations are connected, this view should surface watch time, newsletter signups, clip saves, guest conversion, and community response signals with clear interpretation for leadership.
        </p>
      </Card>
    </div>
  );
}
