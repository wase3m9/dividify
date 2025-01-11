import { Document, Paragraph, TextRun, AlignmentType, convertInchesToTwip, Spacing } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';

export const generateWord = async (data: DividendVoucherData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Company header (centered with proper spacing)
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: convertInchesToTwip(0.2),
          },
          children: [
            new TextRun({
              text: data.companyName,
              bold: true,
              size: 36,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: convertInchesToTwip(0.1),
          },
          children: [
            new TextRun({
              text: data.registeredAddress,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: {
            after: convertInchesToTwip(0.3),
          },
          children: [
            new TextRun({
              text: `Company Registration No: ${data.registrationNumber}`,
              size: 24,
            }),
          ],
        }),
        
        // Voucher number (right aligned)
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: {
            after: convertInchesToTwip(0.2),
          },
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
          spacing: {
            after: convertInchesToTwip(0.1),
          },
          children: [
            new TextRun({ 
              text: "To:",
              size: 24,
              bold: true
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: {
            after: convertInchesToTwip(0.1),
          },
          children: [
            new TextRun({
              text: data.shareholderName,
              size: 24,
            }),
          ],
        }),
        // Shareholder address
        ...data.shareholderAddress.split(',').map(line => 
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              after: convertInchesToTwip(0.1),
            },
            children: [
              new TextRun({
                text: line.trim(),
                size: 24,
              }),
            ],
          })
        ),
        
        // Add spacing before declaration
        new Paragraph({ 
          spacing: { after: convertInchesToTwip(0.3) },
          children: [new TextRun({ text: "" })]
        }),
        
        // Declaration (left aligned)
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: {
            after: convertInchesToTwip(0.1),
          },
          children: [
            new TextRun({
              text: `${data.companyName} has declared the final dividend`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: {
            after: convertInchesToTwip(0.2),
          },
          children: [
            new TextRun({
              text: `for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} as follows:`,
              size: 24,
            }),
          ],
        }),
        
        // Payment details with proper spacing
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.2) },
          children: [
            new TextRun({
              text: `Payment Date: ${format(new Date(data.paymentDate), 'dd/MM/yyyy')}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.2) },
          children: [
            new TextRun({
              text: `Share Class: ${data.shareClass}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.2) },
          children: [
            new TextRun({
              text: `Number of Shares: ${data.holdings || '0'}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.2) },
          children: [
            new TextRun({
              text: `Amount per Share: £${data.amountPerShare}`,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.4) },
          children: [
            new TextRun({
              text: `Total Amount: £${data.totalAmount}`,
              size: 24,
            }),
          ],
        }),
        
        // Signature section with proper spacing
        new Paragraph({
          spacing: { after: convertInchesToTwip(0.2) },
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