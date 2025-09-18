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
import { DividendVoucherData } from '@/utils/documentGenerator/types';
import { generateDividendVoucherPDF, downloadPDF } from '@/utils/documentGenerator/react-pdf';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage';
import { useQueryClient } from '@tanstack/react-query';

const dividendVoucherSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyRegNumber: z.string().min(1, 'Registration number is required'),
  shareholderName: z.string().min(1, 'Shareholder name is required'),
  shareholderAddress: z.string().min(1, 'Shareholder address is required'),
  voucherNumber: z.string().optional(),
  paymentDate: z.string().min(1, 'Payment date is required'),
  shareholdersAsAtDate: z.string().min(1, 'Shareholders as at date is required'),
  yearEndDate: z.string().min(1, 'Year end date is required'),
  dividendType: z.enum(['Final', 'Interim'], { required_error: 'Please select dividend type' }),
  sharesHeld: z.number().min(1, 'Number of shares must be greater than 0'),
  dividendAmount: z.number().min(0.01, 'Dividend amount must be greater than 0'),
  templateStyle: z.enum(['classic', 'modern', 'green', 'executive', 'legal', 'corporateElite', 'royal', 'elite', 'platinum', 'ornate', 'magistrate']).optional(),
});

interface DividendVoucherFormProps {
  initialData?: Partial<DividendVoucherData>;
  companyId?: string; // When set, restrict to this specific company
}

export const DividendVoucherFormComponent: React.FC<DividendVoucherFormProps> = ({ initialData, companyId }) => {
  const [previewData, setPreviewData] = useState<DividendVoucherData | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId || '');
  const [selectedShareholderId, setSelectedShareholderId] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const { data: usage } = useMonthlyUsage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getPlanLimits = (plan: string, userType?: string) => {
    // Accountants should have unlimited access regardless of their subscription plan
    if (userType === 'accountant') {
      return { dividends: Infinity };
    }
    
    switch (plan) {
      case 'professional':
        return { dividends: 10 };
      case 'enterprise':
        return { dividends: Infinity } as const;
      default:
        return { dividends: 2 };
    }
  };

  // Get user profile for logo
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('logo_url, full_name, user_type')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

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

  // Auto-populate voucher number when company is selected
  useEffect(() => {
    const populateVoucherNumber = async () => {
      if (selectedCompanyId && companyData) {
        try {
          // Get the next voucher number for preview (this will increment the counter)
          const { data: voucherNumber, error } = await supabase
            .rpc('get_next_voucher_number', { company_id_param: selectedCompanyId });

          if (!error && voucherNumber) {
            const formattedVoucherNumber = String(voucherNumber).padStart(4, '0');
            setValue('voucherNumber', formattedVoucherNumber);
          }
        } catch (error) {
          console.error('Error getting voucher number:', error);
        }
      }
    };

    populateVoucherNumber();
  }, [selectedCompanyId, companyData, setValue]);

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

  // Generate preview (temporary, doesn't count against limits)
  const handleGeneratePreview = async (data: DividendVoucherData) => {
    if (!selectedCompanyId) {
      toast({ variant: 'destructive', title: 'Select a company', description: 'Please select a company first.' });
      return;
    }

    try {
      // Use the voucher number from the form (already populated)
      const voucherNumber = data.voucherNumber || '0001';

      // Map form data to PDF data format with proper defaults
      const mappedData: DividendVoucherData = {
        companyName: data.companyName || '',
        registrationNumber: data.companyRegNumber || '',
        registeredAddress: data.companyAddress || '',
        shareholderName: data.shareholderName || '',
        shareholderAddress: data.shareholderAddress || '',
        shareClass: 'Ordinary',
        paymentDate: data.paymentDate || '',
        amountPerShare: data.dividendAmount ? (data.dividendAmount / (data.sharesHeld || 1)).toFixed(4) : '0.0000',
        totalAmount: data.dividendAmount?.toString() || '0',
        voucherNumber: voucherNumber,
        holdings: data.sharesHeld?.toString() || '0',
        financialYearEnding: data.yearEndDate || '',
        yearEndDate: data.yearEndDate || '',
        dividendType: data.dividendType || 'Final',
        templateStyle: data.templateStyle,
        logoUrl: profile?.logo_url || undefined,
        accountantFirmName: profile?.user_type === 'accountant' ? profile?.full_name : undefined,
        // Keep original data for backwards compatibility
        companyAddress: data.companyAddress,
        companyRegNumber: data.companyRegNumber,
        sharesHeld: data.sharesHeld,
        dividendAmount: data.dividendAmount,
        shareholdersAsAtDate: data.shareholdersAsAtDate
      };
      
      setPreviewData(mappedData);
    } catch (error: any) {
      console.error('Error generating preview:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate preview' });
    }
  };


  // Save & Generate (final version, counts against limits)
  const handleSaveAndGenerate = async () => {
    if (!previewData || isSaving) return;

    setIsSaving(true);
    try {
      const plan = usage?.plan || 'trial';
      const limits = getPlanLimits(plan, profile?.user_type);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated' });
        return;
      }

      // Determine current billing period (subscription period if active, else calendar month)
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      let periodStart: Date;
      let periodEnd: Date;
      if (subscription) {
        periodStart = new Date(subscription.current_period_start);
        periodEnd = new Date(subscription.current_period_end);
      } else {
        const now = new Date();
        periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
        periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
      }

      // Check current usage from profile counters (skip for accountants)
      if (profile?.user_type !== 'accountant') {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('current_month_dividends')
          .eq('id', user.id)
          .single();
        if (profileError) throw profileError;

        const current = profileData?.current_month_dividends || 0;
        if (limits.dividends !== Infinity && current >= limits.dividends) {
          toast({
            variant: 'destructive',
            title: 'Monthly limit reached',
            description: `You have reached your monthly dividend voucher limit (${limits.dividends}). Upgrade to create more.`,
          });
          return;
        }
      }

      if (!selectedCompanyId) {
        toast({ variant: 'destructive', title: 'Select a company', description: 'Please select a company first.' });
        return;
      }

      // Generate the PDF
      const blob = await generateDividendVoucherPDF(previewData);
      
      // Create filename in format: Company Name - Dividend Voucher - DD/MM/YYYY
      const paymentDate = new Date(previewData.paymentDate);
      const formattedDate = paymentDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      const sanitizedCompanyName = previewData.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      const filename = `${sanitizedCompanyName} - Dividend Voucher - ${formattedDate}.pdf`;

      // Upload to storage with user ID folder prefix and timestamp to avoid conflicts
      const timestampedFilename = `dividend-voucher-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dividend_vouchers')
        .upload(`${user.id}/dividends/${timestampedFilename}`, blob, { contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;

      // Persist record for history and usage counting
      const total_dividend = previewData.dividendAmount;
      const number_of_shares = previewData.sharesHeld || 1;
      const dividend_per_share = Number(number_of_shares) ? total_dividend / number_of_shares : total_dividend;

      const { error: insertError } = await supabase.from('dividend_records').insert({
        company_id: selectedCompanyId,
        user_id: user.id,
        shareholder_name: previewData.shareholderName,
        share_class: 'Ordinary',
        payment_date: previewData.paymentDate,
        tax_year: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        dividend_per_share,
        total_dividend,
        number_of_shares,
        file_path: uploadData.path,
        form_data: JSON.stringify(previewData)
      });
      if (insertError) throw insertError;

      // Increment the monthly dividend counter
      const { error: counterError } = await supabase.rpc('increment_monthly_dividends', {
        user_id_param: user.id
      });
      if (counterError) {
        console.error('Error incrementing dividend counter:', counterError);
        // Don't throw here - the main operation succeeded
      }

      // Refresh usage and activity
      queryClient.invalidateQueries({ queryKey: ['monthly-usage'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activity', selectedCompanyId] });

      // Let the user download immediately
      downloadPDF(blob, filename);

      toast({ title: 'Saved & Generated', description: 'Dividend voucher saved to history and downloaded.' });
    } catch (error: any) {
      console.error('Error generating/saving PDF:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to generate document.' });
    } finally {
      setIsSaving(false);
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
              restrictToCompany={companyId}
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
        
        <form onSubmit={handleSubmit(handleGeneratePreview)} className="space-y-4">
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

            {/* Add some spacing */}
            <div className="md:col-span-2 pt-4">
              <div className="border-t border-gray-200 pt-4">
                <Label htmlFor="voucherNumber" className="text-left block">Dividend Voucher Number</Label>
                <Input
                  id="voucherNumber"
                  {...register('voucherNumber')}
                  placeholder="Will be auto-generated"
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Sequential number will be assigned automatically</p>
              </div>
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
              <Label htmlFor="yearEndDate" className="text-left block">Year End Date</Label>
              <Input
                id="yearEndDate"
                type="date"
                {...register('yearEndDate')}
                className="w-full"
              />
              {errors.yearEndDate && (
                <p className="text-sm text-red-600 mt-1">{errors.yearEndDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dividendType" className="text-left block">Dividend Type</Label>
              <select
                id="dividendType"
                {...register('dividendType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select dividend type</option>
                <option value="Final">Final</option>
                <option value="Interim">Interim</option>
              </select>
              {errors.dividendType && (
                <p className="text-sm text-red-600 mt-1">{errors.dividendType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="templateStyle" className="text-left block">Template Style</Label>
              <Select value={templateStyle} onValueChange={(value) => setValue('templateStyle', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic (Mint Green)</SelectItem>
                  <SelectItem value="modern">Modern (Navy Blue)</SelectItem>
                  <SelectItem value="green">Green (Eco Green)</SelectItem>
                  <div className="px-2 py-1 text-xs font-medium text-amber-600 border-t mt-1">
                    Premium Templates
                  </div>
                  <SelectItem value="executive">Executive Premium (Elegant Gray & Gold)</SelectItem>
                  <SelectItem value="legal">Legal Professional (Traditional)</SelectItem>
                  <SelectItem value="corporateElite">Corporate Elite (Modern Blue)</SelectItem>
                  <SelectItem value="royal">Royal Collection (Navy & Red)</SelectItem>
                  <SelectItem value="elite">Elite Emerald (Luxury Green)</SelectItem>
                  <SelectItem value="platinum">Platinum Series (Refined Gray)</SelectItem>
                  <SelectItem value="ornate">Ornate Classic (Traditional Green)</SelectItem>
                  <SelectItem value="magistrate">Magistrate Bronze (Formal Brown)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">Generate Preview</Button>
            {previewData && (
              <Button type="button" onClick={handleSaveAndGenerate} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save & Generate'}
              </Button>
            )}
          </div>
        </form>
      </Card>

      {previewData && (
        <PDFPreview
          data={previewData}
          documentType="dividend-voucher"
          filename={(() => {
            const paymentDate = new Date(previewData.paymentDate);
            const formattedDate = paymentDate.toLocaleDateString('en-GB');
            const sanitizedCompanyName = previewData.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
            return `${sanitizedCompanyName} - Dividend Voucher - ${formattedDate}.pdf`;
          })()}
        />
      )}
    </div>
  );
};