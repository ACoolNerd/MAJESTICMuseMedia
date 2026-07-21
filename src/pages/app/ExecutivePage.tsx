import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';

export default function ExecutivePage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Executive view"
        title="Studio priorities at a glance"
        description="This view helps leadership balance creative output, guest readiness, release quality, and audience growth without losing the emotional tone of the brand."
      />
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard label="Primary risk" value="Rights" note="Guest release collection is the biggest release blocker for S01E01." />
        <StatCard label="Growth lever" value="Newsletter" note="Email capture is the strongest owned-channel priority for launch." />
        <StatCard label="Creative focus" value="Debut quality" note="The first episode must set the standard for every future release." />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Decision board</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            <li>Finalize guest release workflow before editing locks.</li>
            <li>Choose premiere channel strategy for the debut launch.</li>
            <li>Confirm whether the newsletter launches before or alongside the first episode.</li>
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Leadership lens</h2>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            MAJESTIC Muse should scale through strong systems, not frantic output. This view keeps the team aligned on what truly advances the mission and what merely creates motion.
          </p>
        </Card>
      </div>
    </div>
  );
}
