import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface DividendSummaryData {
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  tax_year: string;
  dividend_per_share: number;
  total_dividend: number;
  number_of_shares: number;
}

export const exportToPDF = (data: DividendSummaryData[], filename: string = 'dividend_summary.pdf', directorName: string, taxYear: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Annual Dividend Summary Report', 14, 22);
  
  // Add director and tax year info
  doc.setFontSize(12);
  doc.text(`Director: ${directorName}`, 14, 35);
  doc.text(`Tax Year: ${taxYear}`, 14, 45);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 55);
  
  // Calculate totals
  const totalDividend = data.reduce((sum, item) => sum + Number(item.total_dividend), 0);
  const totalShares = data.reduce((sum, item) => sum + Number(item.number_of_shares), 0);
  
  // Add summary
  doc.setFontSize(11);
  doc.text(`Total Dividend Amount: £${totalDividend.toFixed(2)}`, 14, 70);
  doc.text(`Total Shares: ${totalShares.toLocaleString()}`, 14, 80);
  
  // Prepare table data
  const tableData = data.map(row => [
    row.share_class,
    new Date(row.payment_date).toLocaleDateString('en-GB'),
    `£${Number(row.dividend_per_share).toFixed(4)}`,
    Number(row.number_of_shares).toLocaleString(),
    `£${Number(row.total_dividend).toFixed(2)}`
  ]);
  
  // Add table
  doc.autoTable({
    head: [['Share Class', 'Payment Date', 'Dividend Per Share', 'Number of Shares', 'Total Dividend']],
    body: tableData,
    startY: 90,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [155, 135, 245], // Purple color matching the theme
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      2: { halign: 'right' }, // Dividend per share
      3: { halign: 'right' }, // Number of shares
      4: { halign: 'right' }, // Total dividend
    },
    margin: { left: 14, right: 14 },
  });
  
  // Add footer with totals
  const finalY = (doc as any).lastAutoTable.finalY || 90;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`Total: £${totalDividend.toFixed(2)}`, 14, finalY + 15);
  
  // Add disclaimer
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('This report is generated for self-assessment purposes. Please consult your accountant for tax advice.', 14, finalY + 30);
  
  // Save the PDF
  doc.save(filename);
};