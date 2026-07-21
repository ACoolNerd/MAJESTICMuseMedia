import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

export default function CommunityAppPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Community"
        title="Community operations"
        description="Shape the listener journey from newsletter welcome to live-event follow-up, with moderation and pastoral care in view."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Current priorities</h2>
          <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
            <li>Draft newsletter welcome sequence language.</li>
            <li>Prepare reflection prompts for the debut episode.</li>
            <li>Document moderation response patterns before live launch.</li>
          </ul>
        </Card>
        <Card variant="elevated">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Community promise</h2>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            Every automation, workflow, and follow-up in this system should preserve warmth, thoughtfulness, and human review. No auto-published replies or AI-only community responses are enabled here.
          </p>
        </Card>
      </div>
    </div>
  );
}
