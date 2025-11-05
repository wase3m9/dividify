import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Users, PoundSterling } from 'lucide-react';
import { formatCurrency } from '@/utils/dividendCalculations';

interface DividendSummaryCardProps {
  title: string;
  value: string | number;
  icon: 'total' | 'count' | 'shareholders' | 'average';
  subtitle?: string;
}

const iconMap = {
  total: PoundSterling,
  count: FileText,
  shareholders: Users,
  average: TrendingUp,
};

export const DividendSummaryCard: FC<DividendSummaryCardProps> = ({ 
  title, 
  value, 
  icon,
  subtitle 
}) => {
  const Icon = iconMap[icon];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
