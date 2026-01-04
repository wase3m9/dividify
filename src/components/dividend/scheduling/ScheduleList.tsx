import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecurringDividend, useScheduledDividends } from "@/hooks/useScheduledDividends";
import { ScheduleCard } from "./ScheduleCard";
import { CreateScheduleDialog } from "./CreateScheduleDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ScheduleListProps {
  companyId: string;
}

export function ScheduleList({ companyId }: ScheduleListProps) {
  const { schedules, isLoading } = useScheduledDividends(companyId);
  const [editingSchedule, setEditingSchedule] = useState<RecurringDividend | null>(null);

  // Fetch shareholders to get names
  const { data: shareholders } = useQuery({
    queryKey: ['shareholders', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shareholders')
        .select('id, shareholder_name, share_class')
        .eq('company_id', companyId);
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const getShareholderName = (shareholderId: string) => {
    const sh = shareholders?.find((s) => s.id === shareholderId);
    return sh?.shareholder_name || sh?.share_class || "Shareholder";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Recurring Dividends</h2>
        </div>
        <CreateScheduleDialog
          companyId={companyId}
          trigger={
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Schedule
            </Button>
          }
        />
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <CalendarClock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">No Recurring Dividends</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Set up automatic dividend vouchers that are generated and emailed on a schedule.
            Perfect for regular "salary replacement" payments.
          </p>
          <CreateScheduleDialog
            companyId={companyId}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Schedule
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              shareholderName={getShareholderName(schedule.shareholder_id)}
              onEdit={(s) => setEditingSchedule(s)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingSchedule && (
        <CreateScheduleDialog
          companyId={companyId}
          editingSchedule={editingSchedule}
          onClose={() => setEditingSchedule(null)}
        />
      )}
    </div>
  );
}
