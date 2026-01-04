import React from 'react';
import { pdf, Font } from '@react-pdf/renderer';
import { DividendVoucherPDF } from './components/DividendVoucherPDF';
import { BoardMinutesPDF } from './components/BoardMinutesPDF';
import { DividendVoucherData, BoardMinutesData } from '../types';

// Register handwriting-style font for electronic signatures
// Using Google Fonts API for reliable access
Font.register({
  family: 'SignatureFont',
  src: 'https://fonts.gstatic.com/s/allura/v21/9oRPNYsQpS4zjuAPjAIXPtrrGA.ttf',
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
