import { Document, Paragraph, TextRun, AlignmentType } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

export const generateWord = async (data: DividendVoucherData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Company header (centered)
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
              text: `Company Registration No: ${data.registrationNumber}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        
        // Voucher number (right aligned)
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: `Dividend Voucher No: ${data.voucherNumber}`,
              size: 24,
            }),
          ],
        }),
        
        // Shareholder details (left aligned)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({ text: "To:", size: 24 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: data.shareholderName,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: data.shareholderAddress,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        
        // Declaration (left aligned)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `A dividend has been declared by ${data.companyName}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `for the financial year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} as follows:`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        
        // Payment details (left aligned)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Payment Date: ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Share Class: ${data.shareClass}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Number of Shares: ${data.holdings || '0'}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Amount per Share: £${data.amountPerShare}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: `Total Amount: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
        
        // Signature section (left aligned)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [
            new TextRun({
              text: "Director Signature",
              size: 24,
              border: {
                style: 'single',
                size: 6,
                space: 1,
              },
            }),
            new TextRun({ text: "     ", size: 24 }),
            new TextRun({
              text: "Director Name",
              size: 24,
              border: {
                style: 'single',
                size: 6,
                space: 1,
              },
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
};