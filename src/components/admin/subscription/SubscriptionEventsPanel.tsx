import { useSubscriptionEvents, useEventCounts } from "@/hooks/useEventMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { CreditCard, XCircle, TrendingUp, TrendingDown } from "lucide-react";

export const SubscriptionEventsPanel = () => {
  const { data: events, isLoading: eventsLoading } = useSubscriptionEvents();
  const { data: counts, isLoading: countsLoading } = useEventCounts(30);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Subscriptions Started
            </CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            {countsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{counts?.subscription_started_count || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-500" />
              Subscriptions Cancelled
            </CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            {countsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{counts?.subscription_cancelled_count || 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent subscription events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscription Events</CardTitle>
          <CardDescription>Latest 20 subscription changes</CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : events && events.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.map((event) => {
                const meta = event.meta as Record<string, unknown>;
                const isStart = event.event_name === 'subscription_started';
                
                return (
                  <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${isStart ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
                      {isStart ? <CreditCard className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">
                          {event.user_full_name || event.user_email || 'Unknown User'}
                        </span>
                        <Badge variant={isStart ? "default" : "secondary"}>
                          {isStart ? 'Started' : 'Cancelled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {event.user_email}
                      </p>
                      {meta?.plan && (
                        <p className="text-sm text-muted-foreground capitalize">
                          Plan: {String(meta.plan)} {meta?.amount ? `- £${Number(meta.amount) / 100}` : ''}
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
            <p className="text-muted-foreground text-center py-8">
              No subscription events recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
