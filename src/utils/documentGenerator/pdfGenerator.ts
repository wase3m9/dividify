import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Company header (centered)
  doc.setFontSize(16);
  doc.text(data.companyName, 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(data.registeredAddress, 105, 30, { align: "center" });
  doc.text(`Company Registration No: ${data.registrationNumber}`, 105, 35, { align: "center" });

  // Add space
  const yStart = 50;

  // Dividend voucher number (right aligned)
  doc.setFontSize(11);
  doc.text(`Dividend Voucher No: ${data.voucherNumber}`, 190, yStart, { align: "right" });

  // Shareholder details (left aligned)
  doc.text("To:", 20, yStart);
  doc.text(data.shareholderName, 20, yStart + 7);
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, yStart + 14 + (index * 7));
    });
  }

  // Declaration text (left aligned)
  const declarationY = yStart + 45;
  doc.setFontSize(11);
  doc.text([
    `A dividend has been declared by ${data.companyName}`,
    `for the financial year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')}`,
    'as follows:'
  ], 20, declarationY);

  // Payment details (left aligned with proper spacing)
  const detailsStart = declarationY + 25;
  doc.setFontSize(11);
  doc.text([
    `Payment Date:          ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
    `Share Class:          ${data.shareClass}`,
    `Number of Shares:     ${data.holdings || '0'}`,
    `Amount per Share:     £${data.amountPerShare}`,
    `Total Amount:         £${data.totalAmount}`
  ], 20, detailsStart);

  // Signature section (left aligned)
  const signatureY = detailsStart + 50;
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Director Signature', 20, signatureY + 5);
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Director Name', 120, signatureY + 5);

  return doc;
};