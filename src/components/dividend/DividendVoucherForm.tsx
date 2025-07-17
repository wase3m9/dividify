import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanySelector } from '@/components/dividend/company/CompanySelector';
import { PDFPreview } from '@/utils/documentGenerator/react-pdf';
import { DividendVoucherData } from '@/utils/documentGenerator/react-pdf/types';
import { generateDividendVoucherPDF, downloadPDF } from '@/utils/documentGenerator/react-pdf';
import { supabase } from '@/integrations/supabase/client';

const dividendVoucherSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyRegNumber: z.string().min(1, 'Registration number is required'),
  shareholderName: z.string().min(1, 'Shareholder name is required'),
  shareholderAddress: z.string().min(1, 'Shareholder address is required'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  shareholdersAsAtDate: z.string().min(1, 'Shareholders as at date is required'),
  sharesHeld: z.number().min(1, 'Number of shares must be greater than 0'),
  dividendAmount: z.number().min(0.01, 'Dividend amount must be greater than 0'),
  templateStyle: z.enum(['classic', 'modern', 'green']).optional(),
});

interface DividendVoucherFormProps {
  initialData?: Partial<DividendVoucherData>;
}

export const DividendVoucherFormComponent: React.FC<DividendVoucherFormProps> = ({ initialData }) => {
  const [previewData, setPreviewData] = useState<DividendVoucherData | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedShareholderId, setSelectedShareholderId] = useState<string>('');

  // Fetch company data
  const { data: companyData } = useQuery({
    queryKey: ['company', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return null;
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', selectedCompanyId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCompanyId,
  });

  // Fetch shareholders for the selected company
  const { data: shareholders } = useQuery({
    queryKey: ['shareholders', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('shareholders')
        .select('*')
        .eq('company_id', selectedCompanyId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedCompanyId,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DividendVoucherData>({
    resolver: zodResolver(dividendVoucherSchema),
    defaultValues: initialData,
  });

  // Auto-fill form when company data is loaded
  useEffect(() => {
    if (companyData) {
      setValue('companyName', companyData.name || '');
      setValue('companyAddress', companyData.registered_address || '');
      setValue('companyRegNumber', companyData.registration_number || '');
    }
  }, [companyData, setValue]);

  // Auto-fill shareholder data when a specific shareholder is selected
  useEffect(() => {
    if (selectedShareholderId && shareholders) {
      const selectedShareholder = shareholders.find(s => s.id === selectedShareholderId);
      if (selectedShareholder) {
        setValue('shareholderName', selectedShareholder.shareholder_name || '');
        setValue('shareholderAddress', selectedShareholder.address || '');
        setValue('sharesHeld', selectedShareholder.number_of_shares || 0);
        
        // Debug log to check what data we're getting
        console.log('Selected shareholder data:', selectedShareholder);
      }
    }
  }, [selectedShareholderId, shareholders, setValue]);

  // Auto-select first shareholder when shareholders are loaded
  useEffect(() => {
    if (shareholders && shareholders.length > 0 && !selectedShareholderId) {
      setSelectedShareholderId(shareholders[0].id);
    }
  }, [shareholders, selectedShareholderId]);

  const templateStyle = watch('templateStyle') || 'classic';

  const onSubmit = (data: DividendVoucherData) => {
    setPreviewData(data);
  };

  const handleDownload = async () => {
    if (!previewData) return;

    try {
      const blob = await generateDividendVoucherPDF(previewData);
      const filename = `dividend-voucher-${Date.now()}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dividend Voucher Generator</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label className="text-left block">Select Company</Label>
            <CompanySelector
              onSelect={setSelectedCompanyId}
              selectedCompanyId={selectedCompanyId}
            />
          </div>
          
          {shareholders && shareholders.length > 0 && (
            <div>
              <Label className="text-left block">Select Shareholder</Label>
              <Select value={selectedShareholderId} onValueChange={setSelectedShareholderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shareholder" />
                </SelectTrigger>
                <SelectContent>
                  {shareholders
                    .filter(shareholder => shareholder.shareholder_name && !shareholder.is_share_class)
                    .map((shareholder) => (
                      <SelectItem key={shareholder.id} value={shareholder.id}>
                        {shareholder.shareholder_name} ({shareholder.number_of_shares} shares)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedCompanyId && companyData && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              ✓ Company data auto-filled from: {companyData.name}
              {selectedShareholderId && shareholders && (
                <span className="block">✓ Shareholder data auto-filled: {shareholders.find(s => s.id === selectedShareholderId)?.shareholder_name || shareholders.find(s => s.id === selectedShareholderId)?.share_class}</span>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName" className="text-left block">Company Name</Label>
              <Input
                id="companyName"
                {...register('companyName')}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companyRegNumber" className="text-left block">Registration Number</Label>
              <Input
                id="companyRegNumber"
                {...register('companyRegNumber')}
                placeholder="Enter registration number"
              />
              {errors.companyRegNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.companyRegNumber.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="companyAddress" className="text-left block">Company Address</Label>
              <Textarea
                id="companyAddress"
                {...register('companyAddress')}
                placeholder="Enter company address"
                rows={2}
                className="resize-none"
              />
              {errors.companyAddress && (
                <p className="text-sm text-red-600 mt-1">{errors.companyAddress.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shareholderName" className="text-left block">Shareholder Name</Label>
              <Input
                id="shareholderName"
                {...register('shareholderName')}
                placeholder="Enter shareholder name"
              />
              {errors.shareholderName && (
                <p className="text-sm text-red-600 mt-1">{errors.shareholderName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="shareholderAddress" className="text-left block">Shareholder Address</Label>
              <Textarea
                id="shareholderAddress"
                {...register('shareholderAddress')}
                placeholder="Enter shareholder address"
                rows={2}
                className="resize-none"
              />
              {errors.shareholderAddress && (
                <p className="text-sm text-red-600 mt-1">{errors.shareholderAddress.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="sharesHeld" className="text-left block">Number of Shares</Label>
              <Input
                id="sharesHeld"
                type="number"
                {...register('sharesHeld', { valueAsNumber: true })}
                placeholder="Enter number of shares"
              />
              {errors.sharesHeld && (
                <p className="text-sm text-red-600 mt-1">{errors.sharesHeld.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dividendAmount" className="text-left block">Dividend Amount (£)</Label>
              <Input
                id="dividendAmount"
                type="number"
                step="0.01"
                {...register('dividendAmount', { valueAsNumber: true })}
                placeholder="Enter dividend amount"
              />
              {errors.dividendAmount && (
                <p className="text-sm text-red-600 mt-1">{errors.dividendAmount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shareholdersAsAtDate" className="text-left block">Shareholders as at Date</Label>
              <Input
                id="shareholdersAsAtDate"
                type="date"
                {...register('shareholdersAsAtDate')}
              />
              {errors.shareholdersAsAtDate && (
                <p className="text-sm text-red-600 mt-1">{errors.shareholdersAsAtDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentDate" className="text-left block">Payment Date</Label>
              <Input
                id="paymentDate"
                type="date"
                {...register('paymentDate')}
              />
              {errors.paymentDate && (
                <p className="text-sm text-red-600 mt-1">{errors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="templateStyle" className="text-left block">Template Style</Label>
              <Select value={templateStyle} onValueChange={(value) => setValue('templateStyle', value as 'classic' | 'modern' | 'green')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic (Mint Green)</SelectItem>
                  <SelectItem value="modern">Modern (Navy Blue)</SelectItem>
                  <SelectItem value="green">Green (Eco Green)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Generate Preview</Button>
            {previewData && (
              <Button type="button" variant="secondary" onClick={handleDownload}>
                Download PDF
              </Button>
            )}
          </div>
        </form>
      </Card>

      {previewData && (
        <PDFPreview
          data={previewData}
          documentType="dividend-voucher"
          filename={`dividend-voucher-${Date.now()}.pdf`}
        />
      )}
    </div>
  );
};