import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

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

export const generateWord = async (data: DividendVoucherData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.companyName,
              bold: true,
              size: 32,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.registeredAddress,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `Registered number: ${data.registrationNumber}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.shareholderName,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: `Dividend voucher number: ${data.voucherNumber}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${data.companyName} has declared the final dividend for the year as follows:`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Payment date: ${data.paymentDate}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Share class: ${data.shareClass}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Shareholder: ${data.shareholderName}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Amount per share: £${data.amountPerShare}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Total dividend payable: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          children: [new TextRun({ text: "" })],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature of Director/Secretary",
              size: 24,
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
};

export const downloadPDF = (data: DividendVoucherData) => {
  const doc = generatePDF(data);
  doc.save(`dividend_voucher_${data.voucherNumber}.pdf`);
};

export const downloadWord = async (data: DividendVoucherData) => {
  const doc = await generateWord(data);
  const blob = await doc.save();
  saveAs(blob, `dividend_voucher_${data.voucherNumber}.docx`);
};