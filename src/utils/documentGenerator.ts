import { jsPDF } from 'jspdf';
import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

interface DividendVoucherData {
  companyName: string;
  registrationNumber: string;
  registeredAddress: string;
  shareholderName: string;
  shareholderAddress: string;
  shareClass: string;
  paymentDate: string;
  amountPerShare: string;
  totalAmount: string;
  voucherNumber: number;
  holdings?: string;
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

  // Add space
  const yStart = 60;

  // Dividend voucher number (right aligned)
  doc.setFontSize(11);
  doc.text(`Dividend voucher number: ${data.voucherNumber}`, 150, yStart, { align: "right" });

  // Shareholder details (left aligned)
  doc.text(data.shareholderName, 20, yStart);
  doc.setFontSize(10);
  const addressLines = data.shareholderAddress.split(',');
  addressLines.forEach((line, index) => {
    doc.text(line.trim(), 20, yStart + 5 + (index * 5));
  });

  // Add space before payment details
  const detailsStart = yStart + 40;

  // Format date to UK format
  const formattedDate = format(new Date(data.paymentDate), 'dd/MM/yyyy');

  // Payment details
  doc.setFontSize(10);
  doc.text([
    `Payment Date:          ${formattedDate}`,
    `Shareholder:          ${data.shareholderName}`,
    `Share class:          ${data.shareClass}`,
    `Dividend payable:     £${data.totalAmount}`,
    `Holdings:             ${data.holdings || 'N/A'}`,
  ], 20, detailsStart);

  // Signature lines
  const signatureY = 150;
  
  // Left side - Signature
  doc.line(20, signatureY, 80, signatureY);
  doc.text('Signature of Director/Secretary', 20, signatureY + 10);
  
  // Right side - Name
  doc.line(120, signatureY, 180, signatureY);
  doc.text('Name of Director/Secretary', 120, signatureY + 10);

  return doc;
};

export const generateWord = async (data: DividendVoucherData) => {
  const formattedDate = format(new Date(data.paymentDate), 'dd/MM/yyyy');
  
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
        new Paragraph({ children: [new TextRun({ text: "\n\n\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.shareholderName,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: data.shareholderAddress,
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
        new Paragraph({ children: [new TextRun({ text: "\n\n\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Payment Date: ${formattedDate}`,
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
              text: `Share class: ${data.shareClass}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Dividend payable: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Holdings: ${data.holdings || 'N/A'}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n\n\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature of Director/Secretary",
              size: 24,
            }),
            new TextRun({
              text: "                    ",
              size: 24,
            }),
            new TextRun({
              text: "Name of Director/Secretary",
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
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `dividend_voucher_${data.voucherNumber}.docx`);
};