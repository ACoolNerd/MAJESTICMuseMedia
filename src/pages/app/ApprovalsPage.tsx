import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ReleaseGateStatus from '../../components/ui/ReleaseGateStatus';
import { seedEpisodes } from '../../lib/seed-data';

export default function ApprovalsPage() {
  const debut = seedEpisodes[0];

  return (
    <div>
      <AppPageHeader
        eyebrow="Workflow"
        title="Approvals"
        description="Track the release gates, sign-offs, and outstanding requests required before an episode moves into public distribution."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>S01E01 approval path</h2>
          <ReleaseGateStatus gates={debut.releaseGates} />
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Next approvals needed</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            <li>Secure guest appearance release.</li>
            <li>Confirm final metadata package for YouTube and website.</li>
            <li>Validate technical pass after audio cleanup.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
