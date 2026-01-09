import { useUserEvents } from "@/hooks/useEventMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { 
  FileText, 
  AlertCircle, 
  Download, 
  Zap, 
  CreditCard, 
  XCircle 
} from "lucide-react";

interface UserEventTimelineProps {
  userId: string | null;
}

const eventIcons: Record<string, React.ElementType> = {
  generation_created: FileText,
  generation_failed: AlertCircle,
  pdf_downloaded: Download,
  api_call: Zap,
  subscription_started: CreditCard,
  subscription_cancelled: XCircle,
};

const eventLabels: Record<string, string> = {
  generation_created: 'Generation Created',
  generation_failed: 'Generation Failed',
  pdf_downloaded: 'PDF Downloaded',
  api_call: 'API Call',
  subscription_started: 'Subscription Started',
  subscription_cancelled: 'Subscription Cancelled',
};

const eventColors: Record<string, string> = {
  generation_created: 'bg-primary',
  generation_failed: 'bg-destructive',
  pdf_downloaded: 'bg-secondary',
  api_call: 'bg-muted-foreground',
  subscription_started: 'bg-green-500',
  subscription_cancelled: 'bg-orange-500',
};

export const UserEventTimeline = ({ userId }: UserEventTimelineProps) => {
  const { data: events, isLoading } = useUserEvents(userId);

  if (!userId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : events && events.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event) => {
              const Icon = eventIcons[event.event_name] || FileText;
              const meta = event.meta as Record<string, unknown>;
              
              return (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${eventColors[event.event_name]} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{eventLabels[event.event_name]}</span>
                      {meta?.doc_type && (
                        <Badge variant="outline" className="text-xs">
                          {String(meta.doc_type).replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                    {meta?.message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {String(meta.message)}
                      </p>
                    )}
                    {meta?.endpoint && (
                      <p className="text-sm text-muted-foreground">
                        {String(meta.method)} {String(meta.endpoint)} - {String(meta.status)} ({String(meta.ms)}ms)
                      </p>
                    )}
                    {meta?.plan && (
                      <p className="text-sm text-muted-foreground capitalize">
                        Plan: {String(meta.plan)}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">No events recorded for this user</p>
        )}
      </CardContent>
    </Card>
  );
};
