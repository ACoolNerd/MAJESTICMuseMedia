import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';

export default function MediaPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Production"
        title="Media library"
        description="This is where captured video, audio, transcripts, graphics, and project exports will be organized once Firebase Storage is connected."
      />
      <Card variant="elevated">
        <EmptyState
          title="No media uploaded yet"
          message="When recordings, transcripts, and cut assets are connected, they will appear here with searchable metadata and workflow status."
          icon="◫"
        />
      </Card>
    </div>
  );
}
