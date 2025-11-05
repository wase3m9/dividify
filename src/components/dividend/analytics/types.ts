export type PeriodType = 'current-month' | 'current-tax-year' | 'all-time';

export interface ShareholderDividendSummary {
  shareholderName: string;
  shareClass: string;
  totalAmount: number;
  dividendCount: number;
  averageAmount: number;
  lastPaymentDate: Date | null;
  yearToDateTotal: number;
  currentMonthTotal: number;
}

export interface DividendPeriodSummary {
  period: PeriodType;
  totalAmount: number;
  dividendCount: number;
  shareholderBreakdown: ShareholderDividendSummary[];
}

export interface DividendRecord {
  id: string;
  shareholder_name: string;
  share_class: string;
  total_dividend: number;
  payment_date: string;
  company_id: string;
}
