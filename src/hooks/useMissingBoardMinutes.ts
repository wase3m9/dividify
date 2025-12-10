import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MissingBoardMinutesOptions {
  companyId?: string;
}

export interface MissingDividend {
  id: string;
  shareholder_name: string;
  payment_date: string;
  total_dividend: number;
  company_id: string;
  created_at: string;
}

export const useMissingBoardMinutes = (options: MissingBoardMinutesOptions = {}) => {
  const { companyId } = options;

  return useQuery({
    queryKey: ['missing-board-minutes', companyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { missingCount: 0, dividends: [] };

      // Calculate 24 hours ago
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from('dividend_records')
        .select('id, shareholder_name, payment_date, total_dividend, company_id, created_at')
        .eq('user_id', user.id)
        .is('linked_minutes_id', null)
        .lt('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching missing board minutes:', error);
        return { missingCount: 0, dividends: [] };
      }

      return {
        missingCount: data?.length || 0,
        dividends: (data || []) as MissingDividend[],
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
