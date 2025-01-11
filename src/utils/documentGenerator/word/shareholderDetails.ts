import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { DividendVoucherData } from '../types';

export const createShareholderDetails = (data: DividendVoucherData): Paragraph[] => {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: {
        after: convertInchesToTwip(0.2),
      },
      children: [
        new TextRun({
          text: `Voucher No: ${data.voucherNumber}`,
          size: 24,
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
  ];

  // Add address lines without label
  const addressLines = data.shareholderAddress.split(',');
  addressLines.forEach(line => {
    paragraphs.push(
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
    );
  });

  return paragraphs;
};