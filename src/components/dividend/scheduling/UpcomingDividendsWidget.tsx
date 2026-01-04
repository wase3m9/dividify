import { format } from "date-fns";
import { CalendarClock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScheduledDividends } from "@/hooks/useScheduledDividends";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface UpcomingDividendsWidgetProps {
  companyId?: string;
}

export function UpcomingDividendsWidget({ companyId }: UpcomingDividendsWidgetProps) {
  const { schedules, isLoading } = useScheduledDividends(companyId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  // Get active schedules with upcoming runs, sorted by next run date
  const upcomingSchedules = schedules
    .filter((s) => s.is_active && !s.is_paused && s.next_run_at)
    .sort((a, b) => {
      const dateA = new Date(a.next_run_at!);
      const dateB = new Date(b.next_run_at!);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (upcomingSchedules.length === 0) {
    return null; // Don't show widget if no upcoming dividends
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-primary" />
            Upcoming Dividends
          </CardTitle>
          {companyId && (
            <Link to={`/dividend-board?company=${companyId}`}>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center justify-between py-2 border-b last:border-b-0"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {formatCurrency(schedule.total_amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                {schedule.share_class} shares
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {schedule.next_run_at
                ? format(new Date(schedule.next_run_at), 'dd MMM')
                : 'Pending'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
