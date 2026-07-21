import Card from './Card';

interface StatCardProps {
  label: string;
  value: string;
  note?: string;
}

export default function StatCard({ label, value, note }: StatCardProps) {
  return (
    <Card variant="elevated">
      <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: '#8B2C6F' }}>{label}</p>
      <p className="text-3xl font-semibold" style={{ color: '#F8F4EC' }}>{value}</p>
      {note && <p className="mt-3 text-sm" style={{ color: '#D8A7B1' }}>{note}</p>}
    </Card>
  );
}
