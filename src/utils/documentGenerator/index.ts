import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generatePDF } from './pdf/generator';
import { generateWord } from './word/generator';
import type { DividendVoucherData, BoardMinutesData } from './types';

export const downloadPDF = (data: DividendVoucherData | BoardMinutesData) => {
  const doc = generatePDF(data);
  const fileName = 'voucherNumber' in data 
    ? `dividend_voucher_${data.voucherNumber}.pdf`
    : `board_minutes_${data.meetingDate}.pdf`;
  doc.save(fileName);
  return doc;
};

export const downloadWord = async (data: DividendVoucherData | BoardMinutesData) => {
  const doc = await generateWord(data);
  const blob = await Packer.toBlob(doc);
  const fileName = 'voucherNumber' in data 
    ? `dividend_voucher_${data.voucherNumber}.docx`
    : `board_minutes_${data.meetingDate}.docx`;
  saveAs(blob, fileName);
  return doc;
};

export type { DividendVoucherData, BoardMinutesData };