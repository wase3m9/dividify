import { jsPDF } from 'jspdf';

interface DividendVoucherData {
  companyName: string;
  registrationNumber: string;
  registeredAddress: string;
  shareholderName: string;
  shareClass: string;
  paymentDate: string;
  amountPerShare: string;
  totalAmount: string;
  voucherNumber: number;
}

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

  // Shareholder details
  doc.setFontSize(11);
  doc.text(data.shareholderName, 20, 50);
  
  // Dividend details
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 150, 50, { align: "right" });
  
  doc.setFontSize(10);
  doc.text([
    `${data.companyName} has declared the final dividend for the year as follows:`,
    '',
    `Payment date:             ${data.paymentDate}`,
    `Share class:              ${data.shareClass}`,
    `Shareholder:             ${data.shareholderName}`,
    `Amount per share:      £${data.amountPerShare}`,
    `Total dividend payable: £${data.totalAmount}`,
  ], 20, 80);

  // Signature line
  doc.line(20, 150, 80, 150);
  doc.text('Signature of Director/Secretary', 20, 160);

  return doc;
};

export const downloadPDF = (data: DividendVoucherData) => {
  const doc = generatePDF(data);
  doc.save(`dividend_voucher_${data.voucherNumber}.pdf`);
};