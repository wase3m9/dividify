import { jsPDF } from 'jspdf';
import { DividendVoucherData } from '../types';

export const addShareholderDetails = (doc: jsPDF, data: DividendVoucherData, yStart: number) => {
  doc.setFontSize(11);
  doc.text(`Dividend Voucher No: ${data.voucherNumber}`, 190, yStart, { align: "right" });

  doc.text(data.shareholderName, 20, yStart + 8);
  
  if (data.shareholderAddress) {
    const addressLines = data.shareholderAddress.split(',');
    addressLines.forEach((line, index) => {
      doc.text(line.trim(), 20, yStart + 16 + (index * 7));
    });
  }
};