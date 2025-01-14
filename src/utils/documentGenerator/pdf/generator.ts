import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData, BoardMinutesData } from '../types';

export const generatePDF = (data: DividendVoucherData | BoardMinutesData) => {
  const doc = new jsPDF();
  
  if ('voucherNumber' in data) {
    // Handle dividend voucher generation
    doc.setFontSize(16);
    doc.text(data.companyName, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Company number: ${data.registrationNumber}`, 105, 30, { align: 'center' });
    doc.text(data.registeredAddress, 105, 40, { align: 'center' });
    
    // Add shareholder details
    doc.setFontSize(11);
    const yPos = 70;
    doc.text(data.shareholderName, 20, yPos);
    doc.text(`Voucher No: ${data.voucherNumber}`, 190, yPos, { align: 'right' });
    
    let currentY = yPos + 10;
    if (data.shareholderAddress) {
      const addressLines = data.shareholderAddress.split(',');
      addressLines.forEach((line) => {
        doc.text(line.trim(), 20, currentY);
        currentY += 7;
      });
    }
    
    currentY += 21;
    
    const declarationText = `${data.companyName} has declared a dividend for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} on the shares as follows:`;
    const maxWidth = 170;
    const lines = doc.splitTextToSize(declarationText, maxWidth);
    lines.forEach((line: string, index: number) => {
      doc.text(line, 20, currentY + (index * 7));
    });
    
    currentY += (lines.length * 7) + 14;
    doc.text(`Payment Date: ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`, 20, currentY);
    doc.text(`Share Class: ${data.shareClass}`, 20, currentY + 10);
    doc.text(`Amount per Share: £${data.amountPerShare}`, 20, currentY + 20);
    doc.text(`Total Amount: £${data.totalAmount}`, 20, currentY + 30);
    
    const signatureY = currentY + 60;
    doc.line(20, signatureY, 80, signatureY);
    doc.text('Director Signature', 20, signatureY + 10);
    
    doc.line(120, signatureY, 180, signatureY);
    doc.text('Date', 120, signatureY + 10);
  } else {
    // Handle board minutes generation with adjusted font sizes
    doc.setFontSize(14); // Reduced from 16
    doc.text(data.companyName, 105, 20, { align: 'center' });
    
    doc.setFontSize(10); // Reduced from 12
    doc.text(`Company number: ${data.registrationNumber}`, 105, 30, { align: 'center' });
    doc.text(data.registeredAddress, 105, 40, { align: 'center' });
    
    doc.line(20, 45, 190, 45);
    doc.text('MINUTES OF MEETING OF THE DIRECTORS', 105, 55, { align: 'center' });
    doc.line(20, 60, 190, 60);
    
    let yPos = 75; // Adjusted starting position
    doc.text(`Date held: ${data.meetingDate}`, 20, yPos);
    yPos += 8; // Reduced spacing
    doc.text(`Held at: ${data.meetingAddress}`, 20, yPos);
    yPos += 8;
    doc.text('Present:', 20, yPos);
    
    data.directors.forEach((director) => {
      yPos += 8;
      doc.text(`${director.name} (Director)`, 30, yPos);
    });
    
    yPos += 15;
    doc.text('1. NOTICE AND QUORUM', 20, yPos);
    yPos += 8;
    doc.text('The chairperson reported that sufficient notice of the meeting had been given to all', 20, yPos);
    yPos += 8;
    doc.text('the directors, and as a quorum was present declared the meeting open.', 20, yPos);
    
    yPos += 15;
    doc.text('2. DIVIDEND PAYMENT', 20, yPos);
    yPos += 8;
    const dividendText = `It was resolved, having considered the Company's statutory accounts for the year ended ${data.financialYearEnd} that the Company pay on ${data.paymentDate} a ${data.dividendType.toLowerCase()} dividend for the year of £${data.amount} (${data.shareClassName}) share of £${data.nominalValue} each in respect of the year ended ${data.financialYearEnd} to those shareholders registered at the close of business ${data.paymentDate}.`;
    
    const lines = doc.splitTextToSize(dividendText, 170);
    lines.forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 8;
    });
    
    yPos += 8;
    doc.text('It was resolved that dividend vouchers be distributed to shareholders and bank', 20, yPos);
    yPos += 8;
    doc.text('transfers made accordingly.', 20, yPos);
    
    yPos += 15;
    doc.text('3. CLOSE', 20, yPos);
    yPos += 8;
    doc.text('There being no further business the meeting was closed.', 20, yPos);
  }

  return doc;
};
