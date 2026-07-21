import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

const rightsItems = [
  { asset: 'Guest appearance release', owner: 'Rebecca', status: 'Pending signature' },
  { asset: 'Theme music usage', owner: 'MAJESTIC Muse', status: 'Internal confirmation needed' },
  { asset: 'Episode stills', owner: 'Studio team', status: 'Approved for website and social' },
];

export default function RightsPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="Rights and clearance"
        description="Protect the brand by documenting releases, usage permissions, and any constraints before content is distributed."
      />
      <Card variant="elevated">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#F8F4EC' }}>Clearance register</h2>
        <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
          {rightsItems.map((item) => (
            <li key={item.asset} className="rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
              <p style={{ color: '#F8F4EC' }}>{item.asset}</p>
              <p>Owner: {item.owner}</p>
              <p>Status: {item.status}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
