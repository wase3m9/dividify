import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Company header
  doc.setFontSize(16);
  doc.text(data.companyName, 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(data.registeredAddress, 105, 30, { align: "center" });
  doc.text(`Registered number: ${data.registrationNumber}`, 105, 35, { align: "center" });

  // Add space
  const yStart = 60;

  // Dividend voucher number (right aligned)
  doc.setFontSize(11);
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 150, yStart, { align: "right" });

  // Shareholder details (left aligned)
  doc.text(data.shareholderName, 20, yStart);
  doc.setFontSize(10);
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, yStart + 5 + (index * 5));
    });
  }

  // Add space before declaration
  const declarationY = yStart + 40;
  
  // Declaration text (left aligned)
  doc.setFontSize(11);
  doc.text(`${data.companyName} has declared the final dividend`, 20, declarationY);
  doc.text(`for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} as follows:`, 20, declarationY + 6);

  // Add more space before payment details
  const detailsStart = declarationY + 20;

  // Payment details (left aligned)
  doc.setFontSize(10);
  doc.text([
    `Payment Date:          ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
    '',
    `Share class:          ${data.shareClass}`,
    '',
    `Amount per Share:     £${data.amountPerShare}`,
    '',
    `Total Amount:         £${data.totalAmount}`,
  ], 20, detailsStart);

  // Signature lines
  const signatureY = 150;
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Signature of Director/Secretary', 20, signatureY + 10);
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Name of Director/Secretary', 120, signatureY + 10);

  return doc;
};