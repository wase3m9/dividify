
export interface DividendRecord {
  id: string;
  user_id: string;
  company_id: string;
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  tax_year: string;
  dividend_per_share: number;
  total_dividend: number;
  number_of_shares: number;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface MinuteRecord {
  id: string;
  user_id: string;
  company_id: string;
  meeting_date: string;
  meeting_type: string;
  attendees: string[];
  resolutions: string[];
  file_path: string | null;
  created_at: string;
  updated_at: string;
}
