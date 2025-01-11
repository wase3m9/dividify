import { jsPDF } from 'jspdf';
import { DividendVoucherData } from '../types';
import { addCompanyHeader } from './companyHeader';
import { addShareholderDetails } from './shareholderDetails';
import { addDeclarationSection } from './declarationSection';
import { addPaymentDetails } from './paymentDetails';
import { addSignatureSection } from './signatureSection';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  
  // Add company header
  addCompanyHeader(doc, data);

  // Add shareholder details
  const yStart = 60;
  addShareholderDetails(doc, data, yStart);

  // Add declaration
  const declarationY = yStart + 45;
  addDeclarationSection(doc, data, declarationY);

  // Add payment details
  const detailsStart = declarationY + 25;
  addPaymentDetails(doc, data, detailsStart);

  // Add signature section
  const signatureY = detailsStart + 50;
  addSignatureSection(doc, signatureY);

  return doc;
};