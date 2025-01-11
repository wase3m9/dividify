import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { format } from 'date-fns';
import { DividendVoucherData, BoardMinutesData } from '../types';

export const generateWord = async (data: DividendVoucherData | BoardMinutesData) => {
  if ('voucherNumber' in data) {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Company header
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
          new Paragraph({ text: '' }),
          
          // Voucher number (right-aligned)
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: `Voucher No: ${data.voucherNumber}`,
                size: 24,
              }),
            ],
          }),
          
          // Shareholder details (left-aligned, no labels)
          new Paragraph({
            children: [
              new TextRun({
                text: data.shareholderName,
                size: 24,
              }),
            ],
          }),
          ...data.shareholderAddress.split(',').map(line => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line.trim(),
                  size: 24,
                }),
              ],
            })
          ),
          
          // Spacing
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          
          // Declaration (full width)
          new Paragraph({
            children: [
              new TextRun({
                text: `${data.companyName} has declared the final dividend for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} on the shares as follows:`,
                size: 24,
              }),
            ],
          }),
          
          // Payment details
          new Paragraph({ text: '' }),
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
                text: `Share Class: ${data.shareClass}`,
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
          
          // Signature section
          new Paragraph({ text: '' }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Signature of Director/Secretary",
                size: 24,
                border: {
                  style: 'single',
                  size: 6,
                  space: 1,
                },
              }),
              new TextRun({ text: "     ", size: 24 }),
              new TextRun({
                text: "Name of Director/Secretary",
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
