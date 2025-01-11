import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';

export const addDeclarationSection = (doc: jsPDF, data: DividendVoucherData, yStart: number) => {
  doc.setFontSize(11);
  doc.text([
    `${data.companyName} has declared the final dividend`,
    `for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} as follows:`,
  ], 20, yStart, { align: 'left' });
};