import { FC } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PeriodType } from './types';
import { getCurrentTaxYear, getCurrentMonth } from '@/utils/dividendCalculations';

interface DividendPeriodSelectorProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
}

export const DividendPeriodSelector: FC<DividendPeriodSelectorProps> = ({ value, onChange }) => {
  const taxYear = getCurrentTaxYear();
  const currentMonth = getCurrentMonth();

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as PeriodType)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="current-month">
          {currentMonth.label}
        </TabsTrigger>
        <TabsTrigger value="current-tax-year">
          Tax Year {taxYear.label}
        </TabsTrigger>
        <TabsTrigger value="all-time">
          All Time
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
