import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentTaxYear, getCurrentMonth } from '@/utils/dividendCalculations';
import type { PeriodType, ShareholderDividendSummary, DividendPeriodSummary } from '@/components/dividend/analytics/types';

interface UseDividendAnalyticsOptions {
  companyId?: string;
  period?: PeriodType;
}

export const useDividendAnalytics = ({ companyId, period = 'current-tax-year' }: UseDividendAnalyticsOptions = {}) => {
  return useQuery({
    queryKey: ['dividend-analytics', companyId, period],
    queryFn: async (): Promise<DividendPeriodSummary> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('dividend_records')
        .select('*')
        .eq('user_id', user.id);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      // Apply date filters based on period
      if (period === 'current-tax-year') {
        const { start, end } = getCurrentTaxYear();
        query = query
          .gte('payment_date', start.toISOString().split('T')[0])
          .lte('payment_date', end.toISOString().split('T')[0]);
      } else if (period === 'current-month') {
        const { start, end } = getCurrentMonth();
        query = query
          .gte('payment_date', start.toISOString().split('T')[0])
          .lte('payment_date', end.toISOString().split('T')[0]);
      }

      const { data: records, error } = await query.order('payment_date', { ascending: false });

      if (error) throw error;
      if (!records) return createEmptySummary(period);

      // Calculate totals
      const totalAmount = records.reduce((sum, r) => sum + Number(r.total_dividend), 0);
      const dividendCount = records.length;

      // Group by shareholder (case-insensitive)
      const shareholderMap = new Map<string, ShareholderDividendSummary>();

      for (const record of records) {
        // Create case-insensitive key for grouping
        const key = `${record.shareholder_name.toLowerCase()}-${record.share_class.toLowerCase()}`;
        const amount = Number(record.total_dividend);
        const paymentDate = new Date(record.payment_date);

        if (!shareholderMap.has(key)) {
          shareholderMap.set(key, {
            shareholderName: record.shareholder_name, // Use first occurrence's capitalization
            shareClass: record.share_class,
            totalAmount: 0,
            dividendCount: 0,
            averageAmount: 0,
            lastPaymentDate: null,
            yearToDateTotal: 0,
            currentMonthTotal: 0,
          });
        }

        const summary = shareholderMap.get(key)!;
        summary.totalAmount += amount;
        summary.dividendCount += 1;
        
        if (!summary.lastPaymentDate || paymentDate > summary.lastPaymentDate) {
          summary.lastPaymentDate = paymentDate;
        }
      }

      // Calculate averages and additional metrics
      const shareholderBreakdown = Array.from(shareholderMap.values()).map(s => ({
        ...s,
        averageAmount: s.totalAmount / s.dividendCount,
      }));

      // Sort by total amount descending
      shareholderBreakdown.sort((a, b) => b.totalAmount - a.totalAmount);

      return {
        period,
        totalAmount,
        dividendCount,
        shareholderBreakdown,
      };
    },
    enabled: !!companyId || period !== 'current-tax-year', // Always enabled if period is set
  });
};

const createEmptySummary = (period: PeriodType): DividendPeriodSummary => ({
  period,
  totalAmount: 0,
  dividendCount: 0,
  shareholderBreakdown: [],
});
