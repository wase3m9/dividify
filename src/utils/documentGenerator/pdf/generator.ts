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
    
    doc.line(20, 50, 190, 50);
    doc.text('DIVIDEND VOUCHER', 105, 60, { align: 'center' });
    doc.line(20, 70, 190, 70);
    
    let yPos = 90;
    doc.text(`Shareholder: ${data.shareholderName}`, 20, yPos);
    yPos += 10;
    doc.text(`Address: ${data.shareholderAddress}`, 20, yPos);
    yPos += 10;
    doc.text(`Voucher Number: ${data.voucherNumber}`, 20, yPos);
    yPos += 10;
    doc.text(`Payment Date: ${data.paymentDate}`, 20, yPos);
    yPos += 10;
    doc.text(`Amount per Share: £${data.amountPerShare}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Amount: £${data.totalAmount}`, 20, yPos);
    
    yPos += 20;
    doc.text('Signed: _________________________', 20, yPos);
    yPos += 20;
    doc.text('Dated: _________________________', 20, yPos);
  } else {
    // Handle board minutes generation
    doc.setFontSize(16);
    doc.text(data.companyName, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Company number: ${data.registrationNumber}`, 105, 30, { align: 'center' });
    doc.text(data.registeredAddress, 105, 40, { align: 'center' });
    
    doc.line(20, 50, 190, 50);
    doc.text('MINUTES OF MEETING OF THE DIRECTORS', 105, 60, { align: 'center' });
    doc.line(20, 70, 190, 70);
    
    let yPos = 90;
    doc.text(`Date held: ${data.meetingDate}`, 20, yPos);
    yPos += 10;
    doc.text(`Held at: ${data.meetingAddress}`, 20, yPos);
    yPos += 10;
    doc.text('Present:', 20, yPos);
    
    data.directors.forEach((director) => {
      yPos += 10;
      doc.text(`${director.name} (Director)`, 30, yPos);
    });
    
    yPos += 20;
    doc.text('1. NOTICE AND QUORUM', 20, yPos);
    yPos += 10;
    doc.text('The chairperson reported that sufficient notice of the meeting had been given to all', 20, yPos);
    yPos += 10;
    doc.text('the directors, and as a quorum was present declared the meeting open.', 20, yPos);
    
    yPos += 20;
    doc.text('2. DIVIDEND PAYMENT', 20, yPos);
    yPos += 10;
    const dividendText = `It was resolved, having considered the Company's statutory accounts for the year ended ${data.financialYearEnd} that the Company pay on ${data.paymentDate} a ${data.dividendType.toLowerCase()} dividend for the year of £${data.amount} (${data.shareClassName}) share of £${data.nominalValue} each in respect of the year ended ${data.financialYearEnd} to those shareholders registered at the close of business ${data.paymentDate}.`;
    
    const lines = doc.splitTextToSize(dividendText, 170);
    lines.forEach((line: string) => {
      doc.text(line, 20, yPos);
      yPos += 10;
    });
    
    yPos += 10;
    doc.text('It was resolved that dividend vouchers be distributed to shareholders and bank', 20, yPos);
    yPos += 10;
    doc.text('transfers made accordingly.', 20, yPos);
    
    yPos += 20;
    doc.text('3. CLOSE', 20, yPos);
    yPos += 10;
    doc.text('There being no further business the meeting was closed.', 20, yPos);
    
    yPos += 40;
    doc.text('Signed: _________________________', 20, yPos);
    yPos += 20;
    doc.text('Dated: _________________________', 20, yPos);
  }

  return doc;
};
