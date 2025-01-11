import { Paragraph, TextRun, convertInchesToTwip } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';

export const createPaymentDetails = (data: DividendVoucherData): Paragraph[] => {
  return [
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
  ];
};