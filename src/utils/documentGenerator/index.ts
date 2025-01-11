import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generatePDF } from './pdf/generator';
import { generateWord } from './word/generator';
import type { DividendVoucherData } from './types';

export const downloadPDF = (data: DividendVoucherData) => {
  const doc = generatePDF(data);
  doc.save(`dividend_voucher_${data.voucherNumber}.pdf`);
  return doc;
};

export const downloadWord = async (data: DividendVoucherData) => {
  const doc = await generateWord(data);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `dividend_voucher_${data.voucherNumber}.docx`);
  return doc;
};

export type { DividendVoucherData };