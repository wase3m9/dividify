export interface BoardPackConfig {
  companyId: string;
  companyName: string;
  companyNumber: string;
  registeredAddress: string;
  yearEndDate: string;
  includeCapTable: boolean;
  logoUrl?: string;
  accountantFirmName?: string;
  templateStyle?: string;
  // Selected existing records
  selectedDividendRecords: SelectedDividendRecord[];
  selectedBoardMinutes: SelectedBoardMinutes[];
}

export interface SelectedDividendRecord {
  id: string;
  shareholder_name: string;
  share_class: string;
  number_of_shares: number;
  dividend_per_share: number;
  total_dividend: number;
  payment_date: string;
  form_data?: any;
}

export interface SelectedBoardMinutes {
  id: string;
  meeting_date: string;
  meeting_type: string;
  attendees: string[];
  resolutions: string[];
  form_data?: any;
}

export interface CapTableEntry {
  shareholderName: string;
  role: string;
  shareClass: string;
  sharesHeld: number;
  percentageOwnership: number;
  votingRights: string;
  nominalValue?: number;
  aggregateNominal?: number;
  notes?: string;
}

export interface CapTableData {
  companyName: string;
  companyNumber: string;
  snapshotDate: string;
  shareClassIncluded: string;
  totalIssuedShares: number;
  nominalValuePerShare: number;
  entries: CapTableEntry[];
  logoUrl?: string;
  accountantFirmName?: string;
}

export interface CoverPageData {
  companyName: string;
  companyNumber: string;
  yearEndDate: string;
  includeCapTable: boolean;
  shareholderCount: number;
  generatedDate: string;
  logoUrl?: string;
  accountantFirmName?: string;
}
