import { jsPDF } from 'jspdf';
import { DividendVoucherData } from '../types';

export const addCompanyHeader = (doc: jsPDF, data: DividendVoucherData) => {
  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text(data.companyName, 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.text(data.registeredAddress, 105, 30, { align: "center" });
  doc.text(`Company Registration No: ${data.registrationNumber}`, 105, 35, { align: "center" });
};