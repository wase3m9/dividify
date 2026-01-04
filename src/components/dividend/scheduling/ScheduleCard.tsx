import { format } from "date-fns";
import { Calendar, Clock, Mail, Pause, Play, Trash2, Edit, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { RecurringDividend, useScheduledDividends } from "@/hooks/useScheduledDividends";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ScheduleCardProps {
  schedule: RecurringDividend;
  shareholderName?: string;
  onEdit?: (schedule: RecurringDividend) => void;
}

const frequencyLabels: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};

export function ScheduleCard({ schedule, shareholderName, onEdit }: ScheduleCardProps) {
  const [showHistory, setShowHistory] = useState(false);
  const { togglePause, deleteSchedule, useScheduleRuns } = useScheduledDividends();
  const { data: runs, isLoading: runsLoading } = useScheduleRuns(schedule.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const getStatusBadge = () => {
    if (!schedule.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (schedule.is_paused) {
      return <Badge variant="outline" className="border-amber-500 text-amber-600">Paused</Badge>;
    }
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Active</Badge>;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {formatCurrency(schedule.total_amount)}
              </h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-muted-foreground">
              {shareholderName || "Shareholder"} • {schedule.share_class} shares
            </p>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(schedule)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePause.mutate({ id: schedule.id, isPaused: !schedule.is_paused })}
              disabled={togglePause.isPending}
            >
              {schedule.is_paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this recurring dividend schedule? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteSchedule.mutate(schedule.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{frequencyLabels[schedule.frequency]} on the {schedule.day_of_month}th</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {schedule.next_run_at
                ? `Next: ${format(new Date(schedule.next_run_at), 'dd MMM yyyy')}`
                : 'Not scheduled'}
            </span>
          </div>
        </div>

        {schedule.email_recipients.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{schedule.email_recipients.join(', ')}</span>
          </div>
        )}

        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setShowHistory(!showHistory)}
          >
            <span>Run History</span>
            {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {showHistory && (
            <div className="mt-2 space-y-2">
              {runsLoading ? (
                <p className="text-sm text-muted-foreground text-center py-2">Loading...</p>
              ) : runs && runs.length > 0 ? (
                runs.slice(0, 5).map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                  >
                    <span>{format(new Date(run.scheduled_for), 'dd MMM yyyy')}</span>
                    <div className="flex items-center gap-2">
                      {run.email_sent && (
                        <Mail className="h-3 w-3 text-muted-foreground" />
                      )}
                      <Badge
                        variant={
                          run.status === 'completed'
                            ? 'default'
                            : run.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {run.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No runs yet
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
