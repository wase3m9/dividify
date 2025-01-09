export interface DividendVoucherData {
  companyName: string;
  registrationNumber: string;
  registeredAddress: string;
  shareholderName: string;
  shareholderAddress: string;
  shareClass: string;
  paymentDate: string;
  amountPerShare: string;
  totalAmount: string;
  voucherNumber: number;
  holdings?: string;
  financialYearEnding: string;
}

export interface TemplateConfig {
  fontFamily?: string;
  fontSize?: {
    title: number;
    header: number;
    normal: number;
  };
  colors?: {
    primary: string;
    secondary: string;
  };
}