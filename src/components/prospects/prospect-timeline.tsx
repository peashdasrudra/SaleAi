import { Mail, MessageSquare, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface TimelineEvent {
  id: string;
  type: 'email' | 'reply' | 'status_change' | 'evidence' | 'task';
  description: string;
  timestamp: Date;
  metadata?: any;
}

interface ProspectTimelineProps {
  events: TimelineEvent[];
}

const iconMap = {
  email: <Mail className="h-4 w-4 text-blue-500" />,
  reply: <MessageSquare className="h-4 w-4 text-green-500" />,
  status_change: <Activity className="h-4 w-4 text-yellow-500" />,
  evidence: <FileText className="h-4 w-4 text-purple-500" />,
  task: <CheckCircle2 className="h-4 w-4 text-orange-500" />
};

export function ProspectTimeline({ events }: ProspectTimelineProps) {
  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground italic p-4 text-center">No recent activity</div>;
  }

  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="relative border-l border-muted ml-3 space-y-6">
      {sortedEvents.map((event) => (
        <div key={event.id} className="relative pl-6">
          <div className="absolute -left-3.5 bg-background p-1 rounded-full border border-muted flex items-center justify-center shadow-sm">
            {iconMap[event.type]}
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium">{event.description}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
            </span>
            {event.metadata && (
              <div className="mt-2 text-xs bg-muted p-2 rounded-md">
                {JSON.stringify(event.metadata)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
