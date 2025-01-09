import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';
import { classicConfig } from './templates/classicTemplate';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  const config = classicConfig;
  
  // Set font
  doc.setFont(config.fontFamily);
  
  // Header with mint green background
  doc.setFillColor(152, 226, 208); // Mint green color
  doc.rect(0, 0, 210, 40, 'F');
  
  // Company name
  doc.setFontSize(config.fontSize.title);
  doc.text(data.companyName.toUpperCase(), 105, 20, { align: "center" });
  
  // Company details
  doc.setFontSize(config.fontSize.header);
  doc.text(data.registeredAddress, 105, 25, { align: "center" });
  doc.text(`Registered number: ${data.registrationNumber}`, 105, 30, { align: "center" });

  // Shareholder address (top left)
  doc.setFontSize(config.fontSize.normal);
  const addressLines = data.shareholderAddress.split(',');
  addressLines.forEach((line, index) => {
    doc.text(line.trim(), 20, 50 + (index * 5));
  });
  
  // Dividend voucher number
  doc.setFontSize(config.fontSize.normal);
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 20, 80);

  // Declaration text
  const yearEnd = format(new Date(data.financialYearEnding), 'dd MMM yyyy');
  const declarationText = 
    `${data.companyName} has declared the final dividend for the year ending ${yearEnd} on its`;
  doc.text(declarationText, 20, 95);
  doc.text(`${data.shareClass} shares as follows:`, 20, 100);

  // Payment details table with mint green background
  const tableY = 115;
  const leftCol = 20;
  const rightCol = 80;
  const rowHeight = 7;

  const rows = [
    ['Payment date:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
    ['Shareholders as at:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
    ['Shareholder:', data.shareholderName],
    ['Holding:', data.holdings || ''],
    ['Dividend payable:', `£${data.totalAmount}`],
  ];

  rows.forEach((row, index) => {
    // Draw cell background
    doc.setFillColor(152, 226, 208);
    doc.rect(leftCol, tableY + (index * rowHeight), 50, 7, 'F');
    
    // Add text
    doc.text(row[0], leftCol + 2, tableY + 5 + (index * rowHeight));
    doc.text(row[1], rightCol, tableY + 5 + (index * rowHeight));
  });

  // Signature lines
  const signatureY = 180;
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Signature of Director/Secretary', 20, signatureY + 5);
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Name of Director/Secretary', 120, signatureY + 5);

  return doc;
};