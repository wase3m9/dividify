import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';
import { modernConfig } from './templates/modernTemplate';

export const generatePDF = (data: DividendVoucherData) => {
  const doc = new jsPDF();
  const config = modernConfig;
  
  // Set font
  doc.setFont(config.fontFamily || "helvetica");
  
  // Company header with navy background
  doc.setFillColor(config.colors?.primary || '#002B4E');
  doc.rect(0, 0, 210, 20, 'F');
  
  // Company name in white
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(config.fontSize?.title || 18);
  doc.text(data.companyName, 105, 13, { align: "center" });
  
  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Company details
  doc.setFontSize(config.fontSize?.normal || 10);
  doc.text(data.registeredAddress, 105, 30, { align: "center" });
  doc.text(`Registered number: ${data.registrationNumber}`, 105, 35, { align: "center" });

  // Shareholder address (top left)
  const addressLines = data.shareholderAddress.split(',');
  addressLines.forEach((line, index) => {
    doc.text(line.trim(), 20, 50 + (index * 5));
  });
  
  // Dividend voucher number (italics)
  doc.setFont("helvetica", "italic");
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 20, 80);
  doc.setFont("helvetica", "normal");

  // Declaration text
  const yearEnd = format(new Date(data.financialYearEnding), 'dd MMM yyyy');
  const declarationText = 
    `${data.companyName} has declared the final dividend for the year ending ${yearEnd} on its`;
  doc.text(declarationText, 20, 95);
  doc.text(`${data.shareClass} shares as follows:`, 20, 100);

  // Create table for payment details
  const tableY = 115;
  const leftCol = 20;
  const rightCol = 80;
  const rowHeight = 7;

  // Table headers with navy background
  doc.setFillColor(config.colors?.primary || '#002B4E');
  doc.setTextColor(255, 255, 255);

  // Payment details in table format
  const rows = [
    ['Payment date:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
    ['Shareholders as at:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
    ['Shareholder:', data.shareholderName],
    ['Holding:', data.holdings || ''],
    ['Dividend payable:', `£${data.totalAmount}`],
  ];

  rows.forEach((row, index) => {
    // Draw cell background
    doc.setFillColor(config.colors?.primary || '#002B4E');
    doc.rect(leftCol, tableY + (index * rowHeight), 50, 7, 'F');
    
    // Add white text for header
    doc.setTextColor(255, 255, 255);
    doc.text(row[0], leftCol + 2, tableY + 5 + (index * rowHeight));
    
    // Add black text for value
    doc.setTextColor(0, 0, 0);
    doc.text(row[1], rightCol, tableY + 5 + (index * rowHeight));
  });

  // Signature lines
  const signatureY = 180;
  
  // Left side - Signature
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Signature of Director/Secretary', 20, signatureY + 5);
  
  // Right side - Name
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Name of Director/Secretary', 120, signatureY + 5);

  return doc;
};