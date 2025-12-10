export interface BoardPackConfig {
  companyId: string;
  companyName: string;
  companyNumber: string;
  registeredAddress: string;
  yearEndDate: string;
  dividendDate: string;
  boardMinutesDate: string;
  includeCapTable: boolean;
  logoUrl?: string;
  accountantFirmName?: string;
  templateStyle?: string;
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
