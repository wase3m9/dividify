import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';

export const addPaymentDetails = (doc: jsPDF, data: DividendVoucherData, yStart: number) => {
  doc.setFontSize(11);
  const details = [
    `Payment Date:          ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
    `Share Class:          ${data.shareClass}`,
    `Number of Shares:     ${data.holdings || '0'}`,
    `Amount per Share:     £${data.amountPerShare}`,
    `Total Amount:         £${data.totalAmount}`
  ];
  
  details.forEach((detail, index) => {
    doc.text(detail, 20, yStart + (index * 8));
  });
};