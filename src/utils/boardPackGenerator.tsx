import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
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

  // Fetch shareholders
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

  const shareholderCount = shareholders?.length || 0;
  const totalShares = shareholders?.reduce((sum, s) => sum + s.number_of_shares, 0) || 0;

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

  // 2. Generate Board Minutes
  onProgress?.({ step: 'Generating board minutes...', current: 2, total: 5 });
  
  const boardMinutesData: BoardMinutesData = {
    companyName: config.companyName,
    registrationNumber: config.companyNumber,
    registeredAddress: config.registeredAddress,
    meetingDate: config.boardMinutesDate,
    meetingAddress: config.registeredAddress,
    directors: (officers || []).map(o => ({ name: `${o.forenames} ${o.surname}` })),
    paymentDate: config.dividendDate,
    amount: '0',
    shareClassName: 'Ordinary',
    dividendType: 'Interim',
    nominalValue: '1.00',
    financialYearEnd: config.yearEndDate,
    boardDate: config.boardMinutesDate,
    directorsPresent: (officers || []).map(o => `${o.forenames} ${o.surname}`),
    dividendPerShare: 0,
    totalDividend: 0,
    templateStyle: config.templateStyle,
    logoUrl: config.logoUrl,
    accountantFirmName: config.accountantFirmName,
  };

  const boardMinutesBlob = await pdf(<BoardMinutesPDF data={boardMinutesData} />).toBlob();
  zip.file('02-Board-Minutes.pdf', boardMinutesBlob);

  // 3. Generate Cap Table (if included)
  if (config.includeCapTable) {
    onProgress?.({ step: 'Generating cap table...', current: 3, total: 5 });
    
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
    zip.file('03-Cap-Table-Snapshot.pdf', capTableBlob);
  }

  // 4. Generate Dividend Vouchers
  onProgress?.({ step: 'Generating dividend vouchers...', current: 4, total: 5 });
  
  const vouchersFolder = zip.folder('Dividend-Vouchers');
  
  for (let i = 0; i < (shareholders || []).length; i++) {
    const shareholder = shareholders![i];
    
    const voucherData: DividendVoucherData = {
      companyName: config.companyName,
      registrationNumber: config.companyNumber,
      registeredAddress: config.registeredAddress,
      shareholderName: shareholder.shareholder_name || 'Unknown',
      shareholderAddress: shareholder.address || '',
      shareClass: shareholder.share_class,
      paymentDate: config.dividendDate,
      amountPerShare: '0.00',
      totalAmount: '0.00',
      voucherNumber: `V${String(i + 1).padStart(4, '0')}`,
      holdings: String(shareholder.number_of_shares),
      financialYearEnding: config.yearEndDate,
      dividendType: 'Interim',
      templateStyle: config.templateStyle,
      logoUrl: config.logoUrl,
      accountantFirmName: config.accountantFirmName,
    };

    const voucherBlob = await pdf(<DividendVoucherPDF data={voucherData} />).toBlob();
    const safeName = (shareholder.shareholder_name || 'Unknown')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-');
    vouchersFolder?.file(`Dividend-Voucher-${safeName}.pdf`, voucherBlob);
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
        dividendDate: config.dividendDate,
        boardMinutesDate: config.boardMinutesDate,
        includeCapTable: config.includeCapTable,
        shareholderCount,
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
