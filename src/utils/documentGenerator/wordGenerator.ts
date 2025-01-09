import { Document, Paragraph, TextRun, AlignmentType } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

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
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
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
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        // Declaration text
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${data.companyName} has declared the final dividend`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} as follows:`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Payment Date: ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
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
              text: `Amount per Share: £${data.amountPerShare}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Total Amount: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Signature of Director/Secretary",
              size: 24,
              border: { bottom: { style: 'single', size: 6, space: 1 } },
            }),
            new TextRun({ text: "     ", size: 24 }),
            new TextRun({
              text: "Name of Director/Secretary",
              size: 24,
              border: { bottom: { style: 'single', size: 6, space: 1 } },
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
};