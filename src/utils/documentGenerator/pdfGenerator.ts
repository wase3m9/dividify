import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  
  // Set font and default settings
  doc.setFont("helvetica");
  
  // Company header section (centered, top of page)
  doc.setFontSize(18);
  doc.text(data.companyName, 105, 25, { align: "center" });
  
  doc.setFontSize(11);
  doc.text(data.registeredAddress, 105, 35, { align: "center" });
  doc.text(`Company Registration No: ${data.registrationNumber}`, 105, 42, { align: "center" });

  // Add space before next section
  const yStart = 60;

  // Voucher number (right aligned)
  doc.setFontSize(11);
  doc.text(`Dividend Voucher No: ${data.voucherNumber}`, 190, yStart, { align: "right" });

  // Shareholder details (left aligned with proper spacing)
  doc.text("To:", 20, yStart);
  doc.setFontSize(11);
  doc.text(data.shareholderName, 20, yStart + 8);
  
  // Handle shareholder address with proper line breaks
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, yStart + 16 + (index * 7));
    });
  }

  // Declaration section (left aligned)
  const declarationY = yStart + 45;
  doc.setFontSize(11);
  doc.text([
    `${data.companyName} has declared the final dividend`,
    `for the financial year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')}`,
    'as follows:'
  ], 20, declarationY);

  // Payment details section (left aligned with increased spacing)
  const detailsStart = declarationY + 25;
  doc.setFontSize(11);
  
  // Create payment details with proper spacing and alignment
  const details = [
    `Payment Date:          ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
    `Share Class:          ${data.shareClass}`,
    `Number of Shares:     ${data.holdings || '0'}`,
    `Amount per Share:     £${data.amountPerShare}`,
    `Total Amount:         £${data.totalAmount}`
  ];
  
  details.forEach((detail, index) => {
    doc.text(detail, 20, detailsStart + (index * 8));
  });

  // Signature section (bottom of page)
  const signatureY = detailsStart + 50;
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Director Signature', 20, signatureY + 5);
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Director Name', 120, signatureY + 5);

  return doc;
};