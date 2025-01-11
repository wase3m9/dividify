import { Paragraph, TextRun, convertInchesToTwip } from 'docx';

export const createSignatureSection = (): Paragraph[] => {
  return [
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
  ];
};