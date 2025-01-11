import { jsPDF } from 'jspdf';

export const addSignatureSection = (doc: jsPDF, yStart: number) => {
  doc.line(20, yStart, 80, yStart);
  doc.text('Director Signature', 20, yStart + 5);
  doc.line(120, yStart, 180, yStart);
  doc.text('Director Name', 120, yStart + 5);
};