import { jsPDF } from 'jspdf';
import { DividendVoucherData, BoardMinutesData } from '../types';

export const generatePDF = (data: DividendVoucherData | BoardMinutesData) => {
  const doc = new jsPDF();
  
  if ('voucherNumber' in data) {
    // Handle dividend voucher generation
    // Add company header
    doc.setFontSize(16);
    doc.text(data.companyName, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Company number: ${data.registrationNumber}`, 105, 30, { align: 'center' });
    doc.text(data.registeredAddress, 105, 40, { align: 'center' });
    
    // Add shareholder details on the left
    doc.setFontSize(11);
    doc.text('Shareholder Name:', 20, 60);
    doc.text(data.shareholderName, 20, 70);
    
    doc.text('Shareholder Address:', 20, 85);
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, 95 + (index * 10));
    });
    
    // Add voucher number on the right
    doc.text(`Dividend Voucher No: ${data.voucherNumber}`, 190, 60, { align: 'right' });
    
    // Add declaration
    const yPos = 140; // After 3 line breaks from the address section
    doc.text(`${data.companyName} has declared the final dividend`, 20, yPos);
    doc.text(`for the year ending ${new Date(data.financialYearEnding).toLocaleDateString()} on the shares as follows:`, 20, yPos + 10);
    
    // Add payment details
    doc.text(`Payment Date: ${new Date(data.paymentDate).toLocaleDateString()}`, 20, yPos + 30);
    doc.text(`Share Class: ${data.shareClass}`, 20, yPos + 40);
    doc.text(`Amount per Share: £${data.amountPerShare}`, 20, yPos + 50);
    doc.text(`Total Amount: £${data.totalAmount}`, 20, yPos + 60);
    
    // Add signature lines at the bottom
    const signatureY = yPos + 100;
    doc.line(20, signatureY, 80, signatureY);
    doc.text('Signature of Director/Secretary', 20, signatureY + 10);
    
    doc.line(120, signatureY, 180, signatureY);
    doc.text('Name of Director/Secretary', 120, signatureY + 10);
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
    
    yPos += 25;
    doc.text('Signed: _________________________', 20, yPos);
    yPos += 15;
    doc.text('Dated: _________________________', 20, yPos);
  }

  return doc;
};