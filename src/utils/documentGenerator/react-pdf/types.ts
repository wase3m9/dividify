export interface DividendVoucherData {
  companyName: string;
  companyAddress: string;
  companyRegNumber: string;
  shareholderName: string;
  shareholderAddress: string;
  paymentDate: string;
  shareholdersAsAtDate: string;
  sharesHeld: number;
  dividendAmount: number;
  templateStyle?: 'classic' | 'modern' | 'green';
  logoUrl?: string;
}

export interface BoardMinutesData {
  companyName: string;
  boardDate: string;
  directorsPresent: string[];
  dividendPerShare: number;
  totalDividend: number;
  paymentDate: string;
  templateStyle?: 'classic' | 'modern' | 'green';
  logoUrl?: string;
}

export type DocumentData = DividendVoucherData | BoardMinutesData;

export interface TemplateConfig {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  fonts: {
    title: number;
    heading: number;
    body: number;
    small: number;
  };
}