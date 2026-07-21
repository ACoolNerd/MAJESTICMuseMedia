import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import { seedGuests } from '../../lib/seed-data';
import { GUEST_STATUS_LABELS } from '../../lib/utils';

export default function GuestsAppPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="Guest development"
        description="Track guest status from proposal to release, with topics, episode alignment, and visibility controls in one place."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {seedGuests.map((guest) => (
          <Card key={guest.id} variant="elevated">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-semibold" style={{ color: '#F8F4EC' }}>{guest.name}</h2>
                <p className="text-sm" style={{ color: '#D8A7B1' }}>{guest.bio}</p>
              </div>
              <span className="rounded-full px-3 py-1 text-xs" style={{ backgroundColor: '#8B2C6F22', color: '#F8F4EC' }}>
                {GUEST_STATUS_LABELS[guest.status]}
              </span>
            </div>
            <p className="text-sm mb-3" style={{ color: '#F8F4EC' }}>Topics: {guest.topics.join(', ')}</p>
            <p className="text-xs" style={{ color: '#D8A7B188' }}>Public profile: {guest.isPublic ? 'Visible' : 'Private until confirmed'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
