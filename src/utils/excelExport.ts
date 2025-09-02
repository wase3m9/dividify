import * as XLSX from 'xlsx';

export interface DividendSummaryData {
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  tax_year: string;
  dividend_per_share: number;
  total_dividend: number;
  number_of_shares: number;
}

export const exportToExcel = (data: DividendSummaryData[], filename: string = 'dividend_summary.xlsx') => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet format
  const wsData = [
    // Header row
    ['Shareholder', 'Share Class', 'Payment Date', 'Tax Year', 'Dividend Per Share', 'Total Dividend', 'Number of Shares'],
    // Data rows
    ...data.map(row => [
      row.shareholder_name,
      row.share_class,
      new Date(row.payment_date).toLocaleDateString(),
      row.tax_year,
      `£${row.dividend_per_share}`,
      `£${row.total_dividend}`,
      row.number_of_shares
    ])
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Shareholder
    { wch: 15 }, // Share Class
    { wch: 15 }, // Payment Date
    { wch: 12 }, // Tax Year
    { wch: 18 }, // Dividend Per Share
    { wch: 16 }, // Total Dividend
    { wch: 16 }  // Number of Shares
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Dividend Summary');
  
  // Write file
  XLSX.writeFile(wb, filename);
};