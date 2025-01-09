import { Document, Paragraph, TextRun, AlignmentType, Packer } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

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
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: `Voucher #${data.voucherNumber.toString().padStart(3, '0')}`,
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
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${data.companyName} has declared the final dividend for the year ending as follows:`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({ children: [new TextRun({ text: "\n" })] }),
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
              text: `Share class: ${data.shareClass}`,
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
              text: `Total amount: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        ...(data.holdings ? [
          new Paragraph({
            children: [
              new TextRun({
                text: `Holdings: ${data.holdings}`,
                size: 24,
              }),
            ],
          }),
        ] : []),
        new Paragraph({ children: [new TextRun({ text: "\n\n" })] }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Director Signature",
              size: 24,
            }),
            new TextRun({
              text: "                    ",
              size: 24,
            }),
            new TextRun({
              text: "Date",
              size: 24,
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
};