export interface DividendRecord {
  id: string;
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  financial_year_ending: string;
  amount_per_share: number;
  total_amount: number;
  director_name: string;
  created_at: string;
  file_path: string;
}

export interface MinuteRecord {
  id: string;
  title: string;
  meeting_date: string;
  created_at: string;
  file_path: string;
}
