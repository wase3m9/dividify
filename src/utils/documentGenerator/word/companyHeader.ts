import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { DividendVoucherData } from '../types';

export const createCompanyHeader = (data: DividendVoucherData): Paragraph[] => {
  return [
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
  ];
};