import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import ConnectionRequired from '../../components/ui/ConnectionRequired';
import { capCutAdapter } from '../../services/adapters/capcut.adapter';

export default function CapCutPage() {
  const status = capCutAdapter.getStatus();

  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="CapCut handoff"
        description="Prepare exports, shot lists, and edit packets for the manual CapCut workflow used by the team."
      />
      <ConnectionRequired platform={status.platform} message={status.message} />
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Handoff checklist</h2>
        <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
          <li>Export camera masters and synced audio from Media Library.</li>
          <li>Attach episode brief, brand notes, and target clip list.</li>
          <li>Document preferred intro, lower-third, and outro treatments.</li>
        </ul>
      </Card>
    </div>
  );
}
