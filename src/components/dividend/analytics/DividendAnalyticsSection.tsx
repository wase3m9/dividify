import { FC, useState } from 'react';
import { useDividendAnalytics } from '@/hooks/useDividendAnalytics';
import { DividendPeriodSelector } from './DividendPeriodSelector';
import { DividendSummaryCard } from './DividendSummaryCard';
import { ShareholderDividendWidget } from './ShareholderDividendWidget';
import { Button } from '@/components/ui/button';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import { exportToExcel } from '@/utils/excelExport';
import { useToast } from '@/hooks/use-toast';
import type { PeriodType } from './types';
import { getCurrentTaxYear, getCurrentMonth } from '@/utils/dividendCalculations';
import { Card } from '@/components/ui/card';

interface DividendAnalyticsSectionProps {
  companyId?: string;
  title?: string;
}

export const DividendAnalyticsSection: FC<DividendAnalyticsSectionProps> = ({ 
  companyId,
  title = "Dividend Tracker"
}) => {
  const [period, setPeriod] = useState<PeriodType>('current-tax-year');
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: analytics, isLoading } = useDividendAnalytics({ companyId, period });
  const { toast } = useToast();

  const handleExport = () => {
    if (!analytics || analytics.shareholderBreakdown.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no dividend records for the selected period.",
        variant: "destructive"
      });
      return;
    }

    const exportData = analytics.shareholderBreakdown.map(s => ({
      shareholder_name: s.shareholderName,
      share_class: s.shareClass,
      payment_date: s.lastPaymentDate?.toISOString().split('T')[0] || '',
      tax_year: getCurrentTaxYear().label,
      dividend_per_share: s.averageAmount,
      total_dividend: s.totalAmount,
      number_of_shares: s.dividendCount,
    }));

    const periodLabel = period === 'current-month' 
      ? getCurrentMonth().label 
      : period === 'current-tax-year' 
      ? `Tax Year ${getCurrentTaxYear().label}` 
      : 'All Time';

    exportToExcel(exportData, `dividend_summary_${periodLabel.replace(/\s+/g, '_')}.xlsx`);
    
    toast({
      title: "Export successful",
      description: "Dividend summary has been exported to Excel.",
    });
  };

  const maxAmount = analytics?.shareholderBreakdown.reduce(
    (max, s) => Math.max(max, s.totalAmount), 
    0
  ) || 0;

  const uniqueShareholders = new Set(analytics?.shareholderBreakdown.map(s => s.shareholderName)).size;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          disabled={!analytics || analytics.dividendCount === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          <DividendPeriodSelector value={period} onChange={setPeriod} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DividendSummaryCard
              title="Total Dividends"
              value={analytics?.totalAmount || 0}
              icon="total"
              subtitle="Total paid in period"
              formatAsCurrency={true}
            />
            <DividendSummaryCard
              title="Total Payments"
              value={analytics?.dividendCount || 0}
              icon="count"
              subtitle="Number of dividend vouchers"
              formatAsCurrency={false}
            />
            <DividendSummaryCard
              title="Shareholders"
              value={uniqueShareholders}
              icon="shareholders"
              subtitle="Unique shareholders paid"
              formatAsCurrency={false}
            />
            <DividendSummaryCard
              title="Average Payment"
              value={analytics?.dividendCount ? analytics.totalAmount / analytics.dividendCount : 0}
              icon="average"
              subtitle="Per dividend voucher"
              formatAsCurrency={true}
            />
          </div>

          <ShareholderDividendWidget 
            shareholders={analytics?.shareholderBreakdown || []}
            maxAmount={maxAmount}
          />
        </div>
      )}
    </Card>
  );
};
