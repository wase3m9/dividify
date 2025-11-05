import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { ShareholderDividendSummary } from './types';
import { formatCurrency, getAmountTier } from '@/utils/dividendCalculations';

interface ShareholderDividendWidgetProps {
  shareholders: ShareholderDividendSummary[];
  maxAmount: number;
}

export const ShareholderDividendWidget: FC<ShareholderDividendWidgetProps> = ({ 
  shareholders,
  maxAmount 
}) => {
  if (shareholders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Shareholder Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No dividend payments in this period
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTierColor = (tier: 'high' | 'medium' | 'low') => {
    switch (tier) {
      case 'high': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'medium': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'low': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shareholder Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shareholders.map((shareholder, index) => {
          const percentage = maxAmount > 0 ? (shareholder.totalAmount / maxAmount) * 100 : 0;
          const tier = getAmountTier(shareholder.totalAmount);
          
          return (
            <div key={`${shareholder.shareholderName}-${shareholder.shareClass}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{shareholder.shareholderName}</p>
                    <Badge variant="outline" className="text-xs">
                      {shareholder.shareClass}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{shareholder.dividendCount} payment{shareholder.dividendCount !== 1 ? 's' : ''}</span>
                    {shareholder.lastPaymentDate && (
                      <span>Last: {new Date(shareholder.lastPaymentDate).toLocaleDateString('en-GB')}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-bold">{formatCurrency(shareholder.totalAmount)}</div>
                  <Badge variant="secondary" className={`text-xs ${getTierColor(tier)}`}>
                    Avg: {formatCurrency(shareholder.averageAmount)}
                  </Badge>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
