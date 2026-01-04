import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RecurringDividend {
  id: string;
  user_id: string;
  company_id: string;
  shareholder_id: string;
  amount_per_share: number;
  total_amount: number;
  share_class: string;
  number_of_shares: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  day_of_month: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  is_paused: boolean;
  email_recipients: string[];
  include_board_minutes: boolean;
  template_preference: string;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledDividendRun {
  id: string;
  schedule_id: string;
  user_id: string;
  company_id: string;
  dividend_record_id: string | null;
  minutes_record_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  error_message: string | null;
  scheduled_for: string;
  executed_at: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

export interface CreateScheduleInput {
  company_id: string;
  shareholder_id: string;
  amount_per_share: number;
  total_amount: number;
  share_class: string;
  number_of_shares: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  day_of_month: number;
  start_date: string;
  end_date?: string | null;
  email_recipients: string[];
  include_board_minutes: boolean;
  template_preference?: string;
}

export function useScheduledDividends(companyId?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch schedules for a company or all user schedules
  const schedulesQuery = useQuery({
    queryKey: ['scheduled-dividends', companyId],
    queryFn: async () => {
      let query = supabase
        .from('recurring_dividends')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as RecurringDividend[];
    },
  });

  // Fetch runs for a specific schedule
  const useScheduleRuns = (scheduleId: string) => {
    return useQuery({
      queryKey: ['scheduled-dividend-runs', scheduleId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('scheduled_dividend_runs')
          .select('*')
          .eq('schedule_id', scheduleId)
          .order('scheduled_for', { ascending: false })
          .limit(20);

        if (error) throw error;
        return data as ScheduledDividendRun[];
      },
      enabled: !!scheduleId,
    });
  };

  // Create a new schedule
  const createSchedule = useMutation({
    mutationFn: async (input: CreateScheduleInput) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Calculate next run date
      const { data: nextRunDate, error: calcError } = await supabase.rpc(
        'calculate_next_run_date',
        {
          p_frequency: input.frequency,
          p_day_of_month: input.day_of_month,
          p_start_date: input.start_date,
        }
      );

      if (calcError) throw calcError;

      const { data, error } = await supabase
        .from('recurring_dividends')
        .insert({
          user_id: user.user.id,
          company_id: input.company_id,
          shareholder_id: input.shareholder_id,
          amount_per_share: input.amount_per_share,
          total_amount: input.total_amount,
          share_class: input.share_class,
          number_of_shares: input.number_of_shares,
          frequency: input.frequency,
          day_of_month: input.day_of_month,
          start_date: input.start_date,
          end_date: input.end_date || null,
          email_recipients: input.email_recipients,
          include_board_minutes: input.include_board_minutes,
          template_preference: input.template_preference || 'modern',
          next_run_at: nextRunDate,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Schedule created",
        description: "Your recurring dividend schedule has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['scheduled-dividends'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update a schedule
  const updateSchedule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RecurringDividend> & { id: string }) => {
      // If frequency or day_of_month changed, recalculate next run
      if (updates.frequency || updates.day_of_month) {
        const { data: currentSchedule } = await supabase
          .from('recurring_dividends')
          .select('frequency, day_of_month, start_date, last_run_at')
          .eq('id', id)
          .single();

        if (currentSchedule) {
          const { data: nextRunDate } = await supabase.rpc(
            'calculate_next_run_date',
            {
              p_frequency: updates.frequency || currentSchedule.frequency,
              p_day_of_month: updates.day_of_month || currentSchedule.day_of_month,
              p_last_run: currentSchedule.last_run_at?.split('T')[0] || null,
              p_start_date: currentSchedule.start_date,
            }
          );
          updates.next_run_at = nextRunDate;
        }
      }

      const { data, error } = await supabase
        .from('recurring_dividends')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Schedule updated",
        description: "Your schedule has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['scheduled-dividends'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle pause/resume
  const togglePause = useMutation({
    mutationFn: async ({ id, isPaused }: { id: string; isPaused: boolean }) => {
      const { data, error } = await supabase
        .from('recurring_dividends')
        .update({ is_paused: isPaused })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.isPaused ? "Schedule paused" : "Schedule resumed",
        description: variables.isPaused
          ? "This schedule will not process until resumed."
          : "This schedule will now process on the next scheduled date.",
      });
      queryClient.invalidateQueries({ queryKey: ['scheduled-dividends'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete a schedule
  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('recurring_dividends')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Schedule deleted",
        description: "The recurring dividend schedule has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ['scheduled-dividends'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    schedules: schedulesQuery.data || [],
    isLoading: schedulesQuery.isLoading,
    error: schedulesQuery.error,
    useScheduleRuns,
    createSchedule,
    updateSchedule,
    togglePause,
    deleteSchedule,
  };
}
