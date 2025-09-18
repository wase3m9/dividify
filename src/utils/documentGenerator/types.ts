import { jsPDF } from 'jspdf';
import { Document } from 'docx';

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
  templateStyle?: string;
  logoUrl?: string;
  accountantFirmName?: string;
  // Additional properties for backwards compatibility
  companyAddress?: string;
  companyRegNumber?: string;
  sharesHeld?: number;
  dividendAmount?: number;
  shareholdersAsAtDate?: string;
}

export interface BoardMinutesData {
  companyName: string;
  registrationNumber: string;
  registeredAddress: string;
  meetingDate: string;
  meetingAddress: string;
  directors: { name: string }[];
  paymentDate: string;
  amount: string;
  shareClassName: string;
  dividendType: string;
  nominalValue: string;
  financialYearEnd: string;
  boardDate: string;
  directorsPresent: string[];
  dividendPerShare: number;
  totalDividend: number;
  templateStyle?: string;
  logoUrl?: string;
  accountantFirmName?: string;
}

export interface DocumentGenerator {
  generate: (data: DividendVoucherData | BoardMinutesData) => jsPDF | Document;
}

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