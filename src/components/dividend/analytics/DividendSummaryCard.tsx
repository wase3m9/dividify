import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, Users, PoundSterling } from 'lucide-react';
import { formatCurrency } from '@/utils/dividendCalculations';

interface DividendSummaryCardProps {
  title: string;
  value: string | number;
  icon: 'total' | 'count' | 'shareholders' | 'average';
  subtitle?: string;
  formatAsCurrency?: boolean;
}

const iconMap = {
  total: PoundSterling,
  count: FileText,
  shareholders: Users,
  average: TrendingUp,
};

const colorMap = {
  total: 'bg-emerald-50 border-emerald-200',
  count: 'bg-blue-50 border-blue-200',
  shareholders: 'bg-violet-50 border-violet-200',
  average: 'bg-amber-50 border-amber-200',
};

export const DividendSummaryCard: FC<DividendSummaryCardProps> = ({ 
  title, 
  value, 
  icon,
  subtitle,
  formatAsCurrency = true
}) => {
  const Icon = iconMap[icon];
  const colorClass = colorMap[icon];
  
  const displayValue = typeof value === 'number' 
    ? (formatAsCurrency ? formatCurrency(value) : value.toFixed(2))
    : value;
  
  return (
    <Card className={colorClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {displayValue}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
