import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '@/integrations/supabase/client';
import { BoardPackConfig, CapTableData, CoverPageData, CapTableEntry } from './documentGenerator/react-pdf/types/boardPackTypes';
import { CoverPagePDF } from './documentGenerator/react-pdf/components/CoverPagePDF';
import { CapTablePDF } from './documentGenerator/react-pdf/components/CapTablePDF';
import { BoardMinutesPDF } from './documentGenerator/react-pdf/components/BoardMinutesPDF';
import { DividendVoucherPDF } from './documentGenerator/react-pdf/components/DividendVoucherPDF';
import { BoardMinutesData, DividendVoucherData } from './documentGenerator/types';
import { format, parseISO } from 'date-fns';

export interface GenerationProgress {
  step: string;
  current: number;
  total: number;
}

export const generateBoardPack = async (
  config: BoardPackConfig,
  onProgress?: (progress: GenerationProgress) => void
): Promise<Blob> => {
  const zip = new JSZip();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch shareholders for cap table
  onProgress?.({ step: 'Fetching data...', current: 0, total: 5 });
  
  const { data: shareholders, error: shareholdersError } = await supabase
    .from('shareholders')
    .select('*')
    .eq('company_id', config.companyId)
    .eq('user_id', user.id)
    .eq('is_share_class', false);

  if (shareholdersError) throw shareholdersError;

  // Fetch officers to determine roles
  const { data: officers } = await supabase
    .from('officers')
    .select('*')
    .eq('company_id', config.companyId)
    .eq('user_id', user.id);

  const directorNames = new Set(
    (officers || []).map(o => `${o.forenames} ${o.surname}`.toLowerCase())
  );

  const shareholderCount = config.selectedDividendRecords.length;
  const totalShares = shareholders?.reduce((sum, s) => sum + s.number_of_shares, 0) || 0;
  const totalDividendAmount = config.selectedDividendRecords.reduce((sum, d) => sum + d.total_dividend, 0);

  // 1. Generate Cover Page
  onProgress?.({ step: 'Generating cover page...', current: 1, total: 5 });
  
  const coverPageData: CoverPageData = {
    companyName: config.companyName,
    companyNumber: config.companyNumber,
    yearEndDate: config.yearEndDate,
    includeCapTable: config.includeCapTable,
    shareholderCount,
    generatedDate: new Date().toISOString(),
    logoUrl: config.logoUrl,
    accountantFirmName: config.accountantFirmName,
  };

  const coverPageBlob = await pdf(<CoverPagePDF data={coverPageData} />).toBlob();
  zip.file('01-Cover-Page.pdf', coverPageBlob);

  // 2. Generate Board Minutes from selected minutes (loop through all selected)
  onProgress?.({ step: 'Generating board minutes...', current: 2, total: 5 });
  
  let minutesIndex = 0;
  for (const selectedMinutes of config.selectedBoardMinutes) {
    const formData = selectedMinutes?.form_data as any;
    
    const boardMinutesData: BoardMinutesData = {
      companyName: config.companyName,
      registrationNumber: config.companyNumber,
      registeredAddress: config.registeredAddress,
      meetingDate: selectedMinutes?.meeting_date || '',
      meetingAddress: config.registeredAddress,
      directors: (officers || []).map(o => ({ name: `${o.forenames} ${o.surname}` })),
      paymentDate: config.selectedDividendRecords[0]?.payment_date || '',
      amount: totalDividendAmount.toFixed(2),
      shareClassName: config.selectedDividendRecords[0]?.share_class || 'Ordinary',
      dividendType: formData?.dividendType || 'Interim',
      nominalValue: '1.00',
      financialYearEnd: config.yearEndDate,
      boardDate: selectedMinutes?.meeting_date || '',
      directorsPresent: selectedMinutes?.attendees || (officers || []).map(o => `${o.forenames} ${o.surname}`),
      dividendPerShare: config.selectedDividendRecords[0]?.dividend_per_share || 0,
      totalDividend: totalDividendAmount,
      templateStyle: config.templateStyle,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const boardMinutesBlob = await pdf(<BoardMinutesPDF data={boardMinutesData} />).toBlob();
    const suffix = config.selectedBoardMinutes.length > 1 ? `-${minutesIndex + 1}` : '';
    zip.file(`02-Board-Minutes${suffix}.pdf`, boardMinutesBlob);
    minutesIndex++;
  }

  // 3. Generate Dividend Vouchers from selected records
  onProgress?.({ step: 'Generating dividend vouchers...', current: 3, total: 5 });
  
  const vouchersFolder = zip.folder('Dividend-Vouchers');
  
  for (let i = 0; i < config.selectedDividendRecords.length; i++) {
    const dividend = config.selectedDividendRecords[i];
    const dividendFormData = dividend.form_data as any;
    
    // Find shareholder address from shareholders table
    const shareholder = shareholders?.find(
      s => s.shareholder_name?.toLowerCase() === dividend.shareholder_name.toLowerCase()
    );
    
    const voucherData: DividendVoucherData = {
      companyName: config.companyName,
      registrationNumber: config.companyNumber,
      registeredAddress: config.registeredAddress,
      shareholderName: dividend.shareholder_name,
      shareholderAddress: shareholder?.address || dividendFormData?.shareholderAddress || '',
      shareClass: dividend.share_class,
      paymentDate: dividend.payment_date,
      amountPerShare: dividend.dividend_per_share.toFixed(4),
      totalAmount: dividend.total_dividend.toFixed(2),
      voucherNumber: dividendFormData?.voucherNumber || `V${String(i + 1).padStart(4, '0')}`,
      holdings: String(dividend.number_of_shares),
      financialYearEnding: config.yearEndDate,
      dividendType: dividendFormData?.dividendType || 'Interim',
      templateStyle: config.templateStyle || dividendFormData?.templateStyle,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const voucherBlob = await pdf(<DividendVoucherPDF data={voucherData} />).toBlob();
    const safeName = dividend.shareholder_name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
    vouchersFolder?.file(`Dividend-Voucher-${safeName}.pdf`, voucherBlob);
  }

  // 4. Generate Cap Table (if included) - always last
  if (config.includeCapTable) {
    onProgress?.({ step: 'Generating cap table...', current: 4, total: 5 });
    
    const shareClasses = [...new Set(shareholders?.map(s => s.share_class) || [])];
    
    const capTableEntries: CapTableEntry[] = (shareholders || []).map(s => {
      const isDirector = directorNames.has(s.shareholder_name?.toLowerCase() || '');
      return {
        shareholderName: s.shareholder_name || 'Unknown',
        role: isDirector ? 'Director' : 'Non-director',
        shareClass: s.share_class,
        sharesHeld: s.number_of_shares,
        percentageOwnership: totalShares > 0 ? (s.number_of_shares / totalShares) * 100 : 0,
        votingRights: '1 vote/share',
        notes: s.number_of_shares / totalShares < 0.25 ? 'Minority shareholder' : undefined,
      };
    });

    const capTableData: CapTableData = {
      companyName: config.companyName,
      companyNumber: config.companyNumber,
      snapshotDate: config.yearEndDate,
      shareClassIncluded: shareClasses.length > 1 ? 'All classes' : shareClasses[0] || 'Ordinary',
      totalIssuedShares: totalShares,
      nominalValuePerShare: 1,
      entries: capTableEntries,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const capTableBlob = await pdf(<CapTablePDF data={capTableData} />).toBlob();
    zip.file('04-Cap-Table-Snapshot.pdf', capTableBlob);
  }

  // 5. Generate ZIP
  onProgress?.({ step: 'Creating ZIP file...', current: 5, total: 5 });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // Log activity
  try {
    await supabase.rpc('log_activity', {
      user_id_param: user.id,
      action_param: 'board_pack_generated',
      description_param: `Generated board pack for ${config.companyName}`,
      company_id_param: config.companyId,
      metadata_param: {
        yearEndDate: config.yearEndDate,
        dividendRecordIds: config.selectedDividendRecords.map(d => d.id),
        boardMinutesIds: config.selectedBoardMinutes.map(m => m.id),
        includeCapTable: config.includeCapTable,
        shareholderCount,
        totalDividendAmount,
      },
    });
  } catch (e) {
    console.error('Failed to log activity:', e);
  }

  return zipBlob;
};

export const downloadBoardPack = (blob: Blob, companyName: string, yearEndDate: string) => {
  const safeName = companyName.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  let formattedDate = yearEndDate;
  try {
    formattedDate = format(parseISO(yearEndDate), 'yyyy-MM-dd');
  } catch {}
  
  const fileName = `Board-Pack-${safeName}-YE-${formattedDate}.zip`;
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export interface BoardPackPDF {
  filename: string;
  blob: Blob;
  base64?: string;
}

export const generateBoardPackPDFs = async (
  config: BoardPackConfig,
  onProgress?: (progress: GenerationProgress) => void
): Promise<BoardPackPDF[]> => {
  const pdfs: BoardPackPDF[] = [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch shareholders for cap table
  onProgress?.({ step: 'Fetching data...', current: 0, total: 5 });
  
  const { data: shareholders, error: shareholdersError } = await supabase
    .from('shareholders')
    .select('*')
    .eq('company_id', config.companyId)
    .eq('user_id', user.id)
    .eq('is_share_class', false);

  if (shareholdersError) throw shareholdersError;

  // Fetch officers to determine roles
  const { data: officers } = await supabase
    .from('officers')
    .select('*')
    .eq('company_id', config.companyId)
    .eq('user_id', user.id);

  const directorNames = new Set(
    (officers || []).map(o => `${o.forenames} ${o.surname}`.toLowerCase())
  );

  const shareholderCount = config.selectedDividendRecords.length;
  const totalShares = shareholders?.reduce((sum, s) => sum + s.number_of_shares, 0) || 0;
  const totalDividendAmount = config.selectedDividendRecords.reduce((sum, d) => sum + d.total_dividend, 0);

  // 1. Generate Cover Page
  onProgress?.({ step: 'Generating cover page...', current: 1, total: 5 });
  
  const coverPageData: CoverPageData = {
    companyName: config.companyName,
    companyNumber: config.companyNumber,
    yearEndDate: config.yearEndDate,
    includeCapTable: config.includeCapTable,
    shareholderCount,
    generatedDate: new Date().toISOString(),
    logoUrl: config.logoUrl,
    accountantFirmName: config.accountantFirmName,
  };

  const coverPageBlob = await pdf(<CoverPagePDF data={coverPageData} />).toBlob();
  pdfs.push({ filename: '01-Cover-Page.pdf', blob: coverPageBlob });

  // 2. Generate Board Minutes from selected minutes (loop through all selected)
  onProgress?.({ step: 'Generating board minutes...', current: 2, total: 5 });
  
  let minutesIndex = 0;
  for (const selectedMinutes of config.selectedBoardMinutes) {
    const formData = selectedMinutes?.form_data as any;
    
    const boardMinutesData: BoardMinutesData = {
      companyName: config.companyName,
      registrationNumber: config.companyNumber,
      registeredAddress: config.registeredAddress,
      meetingDate: selectedMinutes?.meeting_date || '',
      meetingAddress: config.registeredAddress,
      directors: (officers || []).map(o => ({ name: `${o.forenames} ${o.surname}` })),
      paymentDate: config.selectedDividendRecords[0]?.payment_date || '',
      amount: totalDividendAmount.toFixed(2),
      shareClassName: config.selectedDividendRecords[0]?.share_class || 'Ordinary',
      dividendType: formData?.dividendType || 'Interim',
      nominalValue: '1.00',
      financialYearEnd: config.yearEndDate,
      boardDate: selectedMinutes?.meeting_date || '',
      directorsPresent: selectedMinutes?.attendees || (officers || []).map(o => `${o.forenames} ${o.surname}`),
      dividendPerShare: config.selectedDividendRecords[0]?.dividend_per_share || 0,
      totalDividend: totalDividendAmount,
      templateStyle: config.templateStyle,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const boardMinutesBlob = await pdf(<BoardMinutesPDF data={boardMinutesData} />).toBlob();
    const suffix = config.selectedBoardMinutes.length > 1 ? `-${minutesIndex + 1}` : '';
    pdfs.push({ filename: `02-Board-Minutes${suffix}.pdf`, blob: boardMinutesBlob });
    minutesIndex++;
  }

  // 3. Generate Dividend Vouchers from selected records
  onProgress?.({ step: 'Generating dividend vouchers...', current: 3, total: 5 });
  
  for (let i = 0; i < config.selectedDividendRecords.length; i++) {
    const dividend = config.selectedDividendRecords[i];
    const dividendFormData = dividend.form_data as any;
    
    // Find shareholder address from shareholders table
    const shareholder = shareholders?.find(
      s => s.shareholder_name?.toLowerCase() === dividend.shareholder_name.toLowerCase()
    );
    
    const voucherData: DividendVoucherData = {
      companyName: config.companyName,
      registrationNumber: config.companyNumber,
      registeredAddress: config.registeredAddress,
      shareholderName: dividend.shareholder_name,
      shareholderAddress: shareholder?.address || dividendFormData?.shareholderAddress || '',
      shareClass: dividend.share_class,
      paymentDate: dividend.payment_date,
      amountPerShare: dividend.dividend_per_share.toFixed(4),
      totalAmount: dividend.total_dividend.toFixed(2),
      voucherNumber: dividendFormData?.voucherNumber || `V${String(i + 1).padStart(4, '0')}`,
      holdings: String(dividend.number_of_shares),
      financialYearEnding: config.yearEndDate,
      dividendType: dividendFormData?.dividendType || 'Interim',
      templateStyle: config.templateStyle || dividendFormData?.templateStyle,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const voucherBlob = await pdf(<DividendVoucherPDF data={voucherData} />).toBlob();
    const safeName = dividend.shareholder_name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
    pdfs.push({ filename: `03-Dividend-Voucher-${safeName}.pdf`, blob: voucherBlob });
  }

  // 4. Generate Cap Table (if included) - always last
  if (config.includeCapTable) {
    onProgress?.({ step: 'Generating cap table...', current: 4, total: 5 });
    
    const shareClasses = [...new Set(shareholders?.map(s => s.share_class) || [])];
    
    const capTableEntries: CapTableEntry[] = (shareholders || []).map(s => {
      const isDirector = directorNames.has(s.shareholder_name?.toLowerCase() || '');
      return {
        shareholderName: s.shareholder_name || 'Unknown',
        role: isDirector ? 'Director' : 'Non-director',
        shareClass: s.share_class,
        sharesHeld: s.number_of_shares,
        percentageOwnership: totalShares > 0 ? (s.number_of_shares / totalShares) * 100 : 0,
        votingRights: '1 vote/share',
        notes: s.number_of_shares / totalShares < 0.25 ? 'Minority shareholder' : undefined,
      };
    });

    const capTableData: CapTableData = {
      companyName: config.companyName,
      companyNumber: config.companyNumber,
      snapshotDate: config.yearEndDate,
      shareClassIncluded: shareClasses.length > 1 ? 'All classes' : shareClasses[0] || 'Ordinary',
      totalIssuedShares: totalShares,
      nominalValuePerShare: 1,
      entries: capTableEntries,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const capTableBlob = await pdf(<CapTablePDF data={capTableData} />).toBlob();
    pdfs.push({ filename: '04-Cap-Table-Snapshot.pdf', blob: capTableBlob });
  }

  onProgress?.({ step: 'Finalizing...', current: 5, total: 5 });

  // Log activity
  try {
    await supabase.rpc('log_activity', {
      user_id_param: user.id,
      action_param: 'board_pack_generated',
      description_param: `Generated board pack PDFs for ${config.companyName}`,
      company_id_param: config.companyId,
      metadata_param: {
        yearEndDate: config.yearEndDate,
        dividendRecordIds: config.selectedDividendRecords.map(d => d.id),
        boardMinutesIds: config.selectedBoardMinutes.map(m => m.id),
        includeCapTable: config.includeCapTable,
        shareholderCount,
        totalDividendAmount,
        pdfCount: pdfs.length,
      },
    });
  } catch (e) {
    console.error('Failed to log activity:', e);
  }

  return pdfs;
};

// Helper to convert blob to base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Merge multiple PDF blobs into a single PDF
export const mergePDFs = async (pdfBlobs: Blob[]): Promise<Blob> => {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBlob of pdfBlobs) {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  // Use slice to ensure we have a proper ArrayBuffer
  return new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
};

// Generate a single merged board pack PDF
export const generateMergedBoardPackPDF = async (
  config: BoardPackConfig,
  onProgress?: (progress: GenerationProgress) => void
): Promise<Blob> => {
  // Generate all individual PDFs
  const pdfs = await generateBoardPackPDFs(config, onProgress);
  
  onProgress?.({ step: 'Merging PDFs...', current: 5, total: 6 });
  
  // Extract blobs in order (they're already sorted correctly)
  const pdfBlobs = pdfs.map(p => p.blob);
  
  // Merge into single PDF
  const mergedBlob = await mergePDFs(pdfBlobs);
  
  onProgress?.({ step: 'Complete', current: 6, total: 6 });
  
  return mergedBlob;
};
