'use client';

const urgentTasks = [
  {
    id: 'u1',
    title: 'Check on Harold - missed medication',
    assignee: 'Sarah',
    due: 'Today',
    priority: 'urgent' as const,
    status: 'pending' as const,
  },
  {
    id: 'u2',
    title: "Review Frank's fall risk assessment",
    assignee: 'Sarah',
    due: 'Today',
    priority: 'urgent' as const,
    status: 'pending' as const,
  },
];

const todayTasks = [
  {
    id: 't1',
    title: 'Margaret morning orientation',
    assignee: 'Sarah',
    due: '8:30 AM',
    priority: 'normal' as const,
    status: 'complete' as const,
    completedAt: '8:30 AM',
  },
  {
    id: 't2',
    title: 'Dorothy cognitive session',
    assignee: 'Sarah',
    due: '',
    priority: 'normal' as const,
    status: 'in-progress' as const,
  },
  {
    id: 't3',
    title: "Update family on Harold's progress",
    assignee: 'Sarah',
    due: '',
    priority: 'normal' as const,
    status: 'pending' as const,
  },
  {
    id: 't4',
    title: 'Evening medication rounds',
    assignee: 'Sarah',
    due: '6:00 PM',
    priority: 'normal' as const,
    status: 'pending' as const,
  },
];

const upcomingTasks = [
  {
    id: 'up1',
    title: 'Margaret weekly assessment',
    assignee: 'Sarah',
    due: 'Tomorrow',
    priority: 'normal' as const,
    status: 'pending' as const,
  },
  {
    id: 'up2',
    title: 'Staff meeting - care plan review',
    assignee: 'Sarah',
    due: 'Wednesday',
    priority: 'normal' as const,
    status: 'pending' as const,
  },
  {
    id: 'up3',
    title: 'Dorothy family conference call',
    assignee: 'Sarah',
    due: 'Thursday',
    priority: 'normal' as const,
    status: 'pending' as const,
  },
];

type Priority = 'urgent' | 'normal';
type Status = 'pending' | 'in-progress' | 'complete';

interface Task {
  id: string;
  title: string;
  assignee: string;
  due: string;
  priority: Priority;
  status: Status;
  completedAt?: string;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const colors = {
    urgent: { bg: '#FEE2E2', text: '#DC2626' },
    normal: { bg: '#E0F2FE', text: '#2563EB' },
  };
  const c = colors[priority];
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const colors: Record<Status, { bg: string; text: string }> = {
    'complete': { bg: '#DCFCE7', text: '#16A34A' },
    'in-progress': { bg: '#FEF3C7', text: '#D97706' },
    'pending': { bg: '#F1F5F9', text: '#64748B' },
  };
  const c = colors[status];
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        textTransform: 'capitalize',
      }}
    >
      {status === 'in-progress' ? 'In Progress' : status}
    </span>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: checked ? 'none' : '2px solid #CBD5E1',
        background: checked ? '#16A34A' : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
      }}
    >
      {checked && (
        <span style={{ color: '#FFF', fontSize: 14, fontWeight: 700 }}>{'\u2713'}</span>
      )}
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const isComplete = task.status === 'complete';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 18px',
        borderBottom: '1px solid #F1F5F9',
      }}
    >
      <Checkbox checked={isComplete} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: isComplete ? '#94A3B8' : '#1E293B',
            textDecoration: isComplete ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </div>
        <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
          {task.assignee}
          {task.completedAt && ` \u00B7 Done at ${task.completedAt}`}
        </div>
      </div>
      {task.due && (
        <span style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>
          {task.due}
        </span>
      )}
      <StatusBadge status={task.status} />
      <PriorityBadge priority={task.priority} />
    </div>
  );
}

function TaskSection({
  title,
  borderColor,
  tasks,
  count,
}: {
  title: string;
  borderColor: string;
  tasks: Task[];
  count: number;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        borderLeft: `4px solid ${borderColor}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
          {title}
        </div>
        <span
          style={{
            background: borderColor,
            color: '#FFF',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 12,
          }}
        >
          {count}
        </span>
      </div>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}

export default function TasksPage() {
  return (
    <div style={{ padding: 32, maxWidth: 960, marginLeft: 240 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
        }}
      >
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1E293B', margin: 0 }}>
            Care Tasks
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0' }}>
            Manage and track daily care activities
          </p>
        </div>
        <button
          style={{
            padding: '10px 20px',
            background: '#2563EB',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New Task
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <TaskSection
          title="Urgent Tasks"
          borderColor="#DC2626"
          tasks={urgentTasks}
          count={urgentTasks.length}
        />
        <TaskSection
          title="Today's Tasks"
          borderColor="#2563EB"
          tasks={todayTasks}
          count={todayTasks.length}
        />
        <TaskSection
          title="Upcoming"
          borderColor="#94A3B8"
          tasks={upcomingTasks}
          count={upcomingTasks.length}
        />
      </div>
    </div>
  );
}
