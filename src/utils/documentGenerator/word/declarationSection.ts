import { Paragraph, TextRun, AlignmentType, convertInchesToTwip } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';

export const createDeclarationSection = (data: DividendVoucherData): Paragraph[] => {
  return [
    new Paragraph({ 
      spacing: { after: convertInchesToTwip(0.3) },
      children: [new TextRun({ text: "" })]
    }),
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
  ];
};