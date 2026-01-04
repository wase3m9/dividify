import React from 'react';
import { pdf, Font } from '@react-pdf/renderer';
import { DividendVoucherPDF } from './components/DividendVoucherPDF';
import { BoardMinutesPDF } from './components/BoardMinutesPDF';
import { DividendVoucherData, BoardMinutesData } from '../types';

// Register handwriting-style font for electronic signatures
Font.register({
  family: 'GreatVibes',
  src: 'https://fonts.gstatic.com/s/greatvibes/v18/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.ttf',
});

export const generateDividendVoucherPDF = async (data: DividendVoucherData): Promise<Blob> => {
  const blob = await pdf(<DividendVoucherPDF data={data} />).toBlob();
  return blob;
};

export const generateBoardMinutesPDF = async (data: BoardMinutesData): Promise<Blob> => {
  const blob = await pdf(<BoardMinutesPDF data={data} />).toBlob();
  return blob;
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
