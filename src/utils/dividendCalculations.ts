import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

/**
 * UK Tax Year runs from April 6 to April 5
 */
export const getCurrentTaxYear = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const taxYearStart = new Date(currentYear, 3, 6); // April 6th (month is 0-indexed)
  
  // If current date is before April 6, we're still in previous tax year
  if (now < taxYearStart) {
    return {
      start: new Date(currentYear - 1, 3, 6),
      end: new Date(currentYear, 3, 5), // April 5th
      label: `${currentYear - 1}/${currentYear.toString().slice(2)}`
    };
  }
  
  return {
    start: taxYearStart,
    end: new Date(currentYear + 1, 3, 5),
    label: `${currentYear}/${(currentYear + 1).toString().slice(2)}`
  };
};

export const getCurrentMonth = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
    label: now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  };
};

export const isInCurrentTaxYear = (date: Date) => {
  const { start, end } = getCurrentTaxYear();
  return isWithinInterval(date, { start, end });
};

export const isInCurrentMonth = (date: Date) => {
  const { start, end } = getCurrentMonth();
  return isWithinInterval(date, { start, end });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getAmountTier = (amount: number): 'high' | 'medium' | 'low' => {
  if (amount >= 10000) return 'high';
  if (amount >= 5000) return 'medium';
  return 'low';
};
