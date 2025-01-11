import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';

export const addDeclarationSection = (doc: jsPDF, data: DividendVoucherData, yStart: number) => {
  doc.setFontSize(11);
  // Create the declaration text in a single line
  const declarationText = `${data.companyName} has declared the final dividend for the year ending ${format(new Date(data.financialYearEnding), 'dd/MM/yyyy')} on the shares as follows:`;
  
  // Split the text only if it exceeds page width
  const maxWidth = 170; // Leaving margins on both sides
  const lines = doc.splitTextToSize(declarationText, maxWidth);
  
  lines.forEach((line: string, index: number) => {
    doc.text(line, 20, yStart + (index * 7));
  });
};