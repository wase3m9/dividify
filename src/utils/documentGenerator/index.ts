import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import { generatePDF } from './pdfGenerator';
import { generateWord } from './wordGenerator';
import type { DividendVoucherData } from './types';

export const downloadPDF = (data: DividendVoucherData) => {
  const doc = generatePDF(data);
  doc.save(`dividend_voucher_${data.voucherNumber}.pdf`);
};

export const downloadWord = async (data: DividendVoucherData) => {
  const doc = await generateWord(data);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `dividend_voucher_${data.voucherNumber}.docx`);
};

export type { DividendVoucherData };