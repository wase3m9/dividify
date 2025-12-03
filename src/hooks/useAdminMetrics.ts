import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminMetrics {
  total_users: number;
  individual_users: number;
  accountant_users: number;
  active_subscriptions: number;
  trial_users: number;
  trials_expiring_soon: number;
  total_companies: number;
  dividends_this_month: number;
  minutes_this_month: number;
}

interface UserGrowthData {
  date: string;
  new_users: number;
}

interface DocumentStatsData {
  date: string;
  vouchers: number;
  minutes: number;
}

export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_admin_dashboard_metrics')
        .single();
      
      if (error) throw error;
      return data as AdminMetrics;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useUserGrowth = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['user-growth', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_growth', { days_back: daysBack });
      
      if (error) throw error;
      return (data || []) as UserGrowthData[];
    },
  });
};

export const useDocumentStats = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['document-stats', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_document_stats', { days_back: daysBack });
      
      if (error) throw error;
      return (data || []) as DocumentStatsData[];
    },
  });
};
