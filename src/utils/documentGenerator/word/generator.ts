import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { DividendVoucherData, BoardMinutesData } from '../types';

export const generateWord = async (data: DividendVoucherData | BoardMinutesData) => {
  if ('voucherNumber' in data) {
    // Handle dividend voucher generation
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
                text: `Company number: ${data.registrationNumber}`,
                size: 24,
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
            text: '',
            spacing: { before: 400, after: 400 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: 'DIVIDEND VOUCHER',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: '',
            spacing: { before: 400, after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Shareholder: ${data.shareholderName}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Address: ${data.shareholderAddress}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Voucher Number: ${data.voucherNumber}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Payment Date: ${data.paymentDate}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Amount per Share: £${data.amountPerShare}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Total Amount: £${data.totalAmount}`,
              }),
            ],
          }),
        ],
      }],
    });

    return doc;
  } else {
    // Handle board minutes generation
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
                text: `Company number: ${data.registrationNumber}`,
                size: 24,
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
            text: '',
            spacing: { before: 400, after: 400 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: 'MINUTES OF MEETING OF THE DIRECTORS',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            text: '',
            spacing: { before: 400, after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date held: ${data.meetingDate}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Held at: ${data.meetingAddress}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Present:',
              }),
            ],
          }),
          ...data.directors.map(director => 
            new Paragraph({
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: `${director.name} (Director)`,
                }),
              ],
            })
          ),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '1. NOTICE AND QUORUM',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'The chairperson reported that sufficient notice of the meeting had been given to all the directors, and as a quorum was present declared the meeting open.',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2. DIVIDEND PAYMENT',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `It was resolved, having considered the Company's statutory accounts for the year ended ${data.financialYearEnd} that the Company pay on ${data.paymentDate} a ${data.dividendType.toLowerCase()} dividend for the year of £${data.amount} (${data.shareClassName}) share of £${data.nominalValue} each in respect of the year ended ${data.financialYearEnd} to those shareholders registered at the close of business ${data.paymentDate}.`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'It was resolved that dividend vouchers be distributed to shareholders and bank transfers made accordingly.',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: '3. CLOSE',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'There being no further business the meeting was closed.',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Signed: _________________________',
              }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Dated: _________________________',
              }),
            ],
          }),
        ],
      }],
    });

    return doc;
  }
};
