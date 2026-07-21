import AppPageHeader from '../../components/ui/AppPageHeader';
import Card from '../../components/ui/Card';

const tasks = [
  { title: 'Collect Rebecca release form', priority: 'Critical', status: 'In progress' },
  { title: 'Draft S01E01 show notes', priority: 'High', status: 'Todo' },
  { title: 'Approve launch thumbnail concept', priority: 'Medium', status: 'Todo' },
];

export default function TasksPage() {
  return (
    <div>
      <AppPageHeader
        eyebrow="Workflow"
        title="Tasks"
        description="A lightweight operational queue for the work that moves episodes from intention to release."
      />
      <Card variant="elevated">
        <ul role="list" className="space-y-3 text-sm" style={{ color: '#D8A7B1' }}>
          {tasks.map((task) => (
            <li key={task.title} className="flex flex-col gap-1 rounded-lg px-4 py-3" style={{ backgroundColor: '#FFFFFF08' }}>
              <span style={{ color: '#F8F4EC' }}>{task.title}</span>
              <span>Priority: {task.priority}</span>
              <span>Status: {task.status}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
