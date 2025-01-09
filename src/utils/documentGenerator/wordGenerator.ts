import { Document, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, BorderStyle, ShadingType } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from './types';
import { classicConfig } from './templates/classicTemplate';

export const generateWord = async (data: DividendVoucherData) => {
  const config = classicConfig;
  const yearEnd = format(new Date(data.financialYearEnding), 'dd MMM yyyy');
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Company header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 200 },
          shading: { type: ShadingType.SOLID, color: '98E2D0' },
          children: [
            new TextRun({
              text: data.companyName.toUpperCase(),
              bold: true,
              size: 32,
            }),
          ],
        }),
        // Company details
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
        // Shareholder address
        ...data.shareholderAddress.split(',').map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(),
                size: 20,
              }),
            ],
          })
        ),
        // Voucher number
        new Paragraph({
          children: [
            new TextRun({
              text: `Dividend voucher number: ${data.voucherNumber}`,
              size: 20,
            }),
          ],
        }),
        // Declaration
        new Paragraph({
          children: [
            new TextRun({
              text: `${data.companyName} has declared the final dividend for the year ending ${yearEnd} on its ${data.shareClass} shares as follows:`,
              size: 20,
            }),
          ],
        }),
        // Payment details table
        new Table({
          rows: [
            ['Payment date:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
            ['Shareholders as at:', format(new Date(data.paymentDate), 'dd MMM yyyy')],
            ['Shareholder:', data.shareholderName],
            ['Holding:', data.holdings || ''],
            ['Dividend payable:', `£${data.totalAmount}`],
          ].map(row => 
            new TableRow({
              children: [
                new TableCell({
                  shading: { type: ShadingType.SOLID, color: '98E2D0' },
                  children: [new Paragraph({
                    children: [new TextRun({ text: row[0], size: 20 })],
                  })],
                }),
                new TableCell({
                  children: [new Paragraph({
                    children: [new TextRun({ text: row[1], size: 20 })],
                  })],
                }),
              ],
            })
          ),
        }),
        // Signature lines
        new Paragraph({
          spacing: { before: 4000 },
          children: [
            new TextRun({
              text: "Signature of Director/Secretary",
              size: 20,
              border: { style: BorderStyle.SINGLE, size: 6, space: 1 },
            }),
            new TextRun({ text: "     ", size: 20 }),
            new TextRun({
              text: "Name of Director/Secretary",
              size: 20,
              border: { style: BorderStyle.SINGLE, size: 6, space: 1 },
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
};