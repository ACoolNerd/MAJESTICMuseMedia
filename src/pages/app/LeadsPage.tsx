import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

const leads = [
  { name: 'Faith Creative Collective', source: 'partner referral', stage: 'qualified' },
  { name: 'Newsletter waitlist listener', source: 'website', stage: 'new' },
  { name: 'Prospective sponsor conversation', source: 'live event', stage: 'nurturing' },
];

export default function LeadsPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Community"
        title="Leads and CRM"
        description="Track potential guests, partners, and aligned opportunities with enough structure to support thoughtful follow-up."
      />
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Lead pipeline</h2>
        <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
          {leads.map((lead) => (
            <li key={lead.name} className="flex flex-col gap-1 rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
              <span style={{ color: '#F8F4EC' }}>{lead.name}</span>
              <span>Source: {lead.source}</span>
              <span>Stage: {lead.stage}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
