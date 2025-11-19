import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionMetrics {
  total_mrr: number;
  active_subscriptions_count: number;
  trial_subscriptions_count: number;
  past_due_count: number;
  canceled_this_month: number;
  trial_conversions_this_month: number;
  starter_count: number;
  professional_count: number;
  enterprise_count: number;
}

interface SubscriptionListItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  plan_code: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  monthly_amount: number;
}

interface SubscriptionDetails {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  user_type: string;
  logo_url: string;
  plan_code: string;
  status: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  monthly_amount: number;
  company_count: number;
  current_month_dividends: number;
  current_month_minutes: number;
}

export const useSubscriptionMetrics = () => {
  return useQuery({
    queryKey: ['subscription-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_subscription_metrics');
      
      if (error) throw error;
      return data?.[0] as SubscriptionMetrics;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useSubscriptionsList = (
  searchTerm?: string,
  filterStatus?: string,
  filterPlan?: string,
  pageSize: number = 20,
  pageNumber: number = 0
) => {
  return useQuery({
    queryKey: ['subscriptions-list', searchTerm, filterStatus, filterPlan, pageSize, pageNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_subscriptions_list', {
          search_term: searchTerm || null,
          filter_status: filterStatus || null,
          filter_plan: filterPlan || null,
          page_size: pageSize,
          page_number: pageNumber,
        });
      
      if (error) throw error;
      return (data || []) as SubscriptionListItem[];
    },
  });
};

export const useSubscriptionDetails = (subscriptionId?: string) => {
  return useQuery({
    queryKey: ['subscription-details', subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) return null;
      
      const { data, error } = await supabase
        .rpc('get_subscription_details', {
          subscription_id_param: subscriptionId,
        });
      
      if (error) throw error;
      return data?.[0] as SubscriptionDetails;
    },
    enabled: !!subscriptionId,
  });
};

export const useSubscriptionActions = () => {
  const queryClient = useQueryClient();

  const cancelSubscription = useMutation({
    mutationFn: async ({ subscriptionId, reason }: { subscriptionId: string; reason?: string }) => {
      const { error } = await supabase
        .rpc('admin_cancel_subscription', {
          subscription_id_param: subscriptionId,
          reason: reason || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions-list'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] });
      toast.success("Subscription canceled successfully");
    },
    onError: (error) => {
      console.error("Cancel subscription error:", error);
      toast.error("Failed to cancel subscription");
    },
  });

  const reactivateSubscription = useMutation({
    mutationFn: async ({ subscriptionId, extendDays }: { subscriptionId: string; extendDays: number }) => {
      const { error } = await supabase
        .rpc('admin_reactivate_subscription', {
          subscription_id_param: subscriptionId,
          extend_days: extendDays,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions-list'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-details'] });
      toast.success("Subscription reactivated successfully");
    },
    onError: (error) => {
      console.error("Reactivate subscription error:", error);
      toast.error("Failed to reactivate subscription");
    },
  });

  return {
    cancelSubscription,
    reactivateSubscription,
  };
};
