import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

const notes = [
  { time: '00:02:14', comment: 'Beautiful opening. Keep the pause before Rebecca answers.' },
  { time: '00:18:40', comment: 'Consider a subtle audio lift to keep the emotional landing clear.' },
  { time: '00:42:05', comment: 'Strong closer—mark as potential trailer clip.' },
];

export default function ReviewPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="Review and feedback"
        description="Capture time-coded review notes, narrative feedback, and approval-ready adjustments without losing the creative thread."
      />
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Mock review notes for S01E01</h2>
        <ul role="list" className="space-y-4 text-sm" style={{ color: '#D8A7B1' }}>
          {notes.map((note) => (
            <li key={note.time} className="rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
              <p style={{ color: '#C9A227' }}>{note.time}</p>
              <p>{note.comment}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
