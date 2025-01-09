import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { DividendVoucherData } from './types';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  
  // Set font
  doc.setFont("helvetica");
  
  // Shareholder address (top left)
  doc.setFontSize(10);
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, 20 + (index * 5));
    });
  }
  
  // Dividend voucher number (top right)
  doc.setFontSize(11);
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 190, 20, { align: "right" });

  // Add space before company details
  const yStart = 60;

  // Company header
  doc.setFontSize(16);
  doc.text(data.companyName, 105, yStart, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(data.registeredAddress, 105, yStart + 10, { align: "center" });
  doc.text(`Registered number: ${data.registrationNumber}`, 105, yStart + 15, { align: "center" });

  // Declaration text
  const declarationY = yStart + 35;
  doc.setFontSize(11);
  const declarationText = `${data.companyName} has declared the final dividend for the year ending ${format(new Date(data.financialYearEnding), 'dd MMM yyyy')} on its ${data.shareClass} shares as follows:`;
  doc.text(declarationText, 20, declarationY);

  // Format date to UK format
  const formattedDate = format(new Date(data.paymentDate), 'dd/MM/yyyy');

  // Payment details
  const detailsStart = declarationY + 20;
  doc.setFontSize(10);
  doc.text([
    `Payment Date:          ${formattedDate}`,
    `Shareholder:          ${data.shareholderName}`,
    `Share class:          ${data.shareClass}`,
    `Dividend payable:     £${data.totalAmount}`,
    `Amount per share:     £${data.amountPerShare}`,
    data.holdings ? `Holdings:             ${data.holdings}` : '',
  ].filter(Boolean), 20, detailsStart);

  // Signature lines
  const signatureY = 150;
  
  // Left side - Signature
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Signature of Director/Secretary', 20, signatureY + 10);
  
  // Right side - Name
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Name of Director/Secretary', 120, signatureY + 10);

  return doc;
};