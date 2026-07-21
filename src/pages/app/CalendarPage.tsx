import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

const events = [
  { date: 'Jul 24, 2026', title: 'S01E01 Recording', detail: 'Rebecca joins Marchette for IDENTITY.' },
  { date: 'Jul 27, 2026', title: 'Audio Review', detail: 'Technical pass and narrative pacing review.' },
  { date: 'Aug 1, 2026', title: 'Premiere Target', detail: 'Debut launch of S01E01 across flagship channels.' },
];

export default function CalendarPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Operations"
        title="Production calendar"
        description="See the milestones that matter most: recordings, review rounds, approvals, and launch targets."
      />
      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.title} variant="elevated">
            <div className="grid gap-2 md:grid-cols-[180px_1fr]">
              <p className="text-sm font-semibold" style={{ color: '#C9A227' }}>{event.date}</p>
              <div>
                <h2 className="text-xl font-semibold" style={{ color: '#F8F4EC' }}>{event.title}</h2>
                <p className="text-sm" style={{ color: '#D8A7B1' }}>{event.detail}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
