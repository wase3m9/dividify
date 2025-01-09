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
  doc.text(`Voucher #${data.voucherNumber.toString().padStart(3, '0')}`, 190, 20, { align: "right" });

  // Shareholder details (left aligned)
  doc.text(data.shareholderName, 20, yStart);
  doc.setFontSize(10);
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, yStart + 5 + (index * 5));
    });
  }

  // Add declaration text
  const declarationY = yStart + 40;
  doc.setFontSize(11);
  doc.text(
    `${data.companyName} has declared the final dividend for the year ending as follows:`,
    105,
    declarationY,
    { align: "center" }
  );

  // Payment details
  const detailsStart = declarationY + 20;
  doc.setFontSize(10);
  doc.text([
    `Payment Date:          ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
    `Share class:          ${data.shareClass}`,
    `Amount per share:     £${data.amountPerShare}`,
    `Total amount:         £${data.totalAmount}`,
    data.holdings ? `Holdings:             ${data.holdings}` : '',
  ].filter(Boolean), 20, detailsStart);

  // Signature lines
  const signatureY = 150;
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Director Signature', 20, signatureY + 10);
  
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Date', 120, signatureY + 10);

  return doc;
};