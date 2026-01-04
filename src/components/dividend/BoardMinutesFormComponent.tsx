import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanySelector } from '@/components/dividend/company/CompanySelector';
import { PDFPreview } from '@/utils/documentGenerator/react-pdf';
import { BoardMinutesData } from '@/utils/documentGenerator/types';
import { generateBoardMinutesPDF, downloadPDF } from '@/utils/documentGenerator/react-pdf';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage';
import { useQueryClient } from '@tanstack/react-query';
import { useLogActivity } from '@/hooks/useActivityLog';
import { Link } from 'lucide-react';
import { HelpTooltip } from '@/components/ui/help-tooltip';

const boardMinutesSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  boardDate: z.string().min(1, 'Board date is required'),
  dividendPerShare: z.number().min(0.0001, 'Dividend per share must be greater than 0'),
  totalDividend: z.number().min(0.01, 'Total dividend must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  templateStyle: z.enum(['classic', 'modern', 'green', 'executive', 'legal', 'corporateElite', 'royal', 'elite', 'platinum', 'ornate', 'magistrate']).optional(),
});

type BoardMinutesFormData = Omit<BoardMinutesData, 'directorsPresent'>;

export interface PrefillFromDividend {
  linkedDividendId: string;
  companyId: string;
  companyName: string;
  paymentDate: string;
  totalDividend: number;
  dividendPerShare: number;
  shareholderName: string;
  yearEndDate: string;
  templateStyle: string;
  boardDate: string;
}

interface BoardMinutesFormProps {
  initialData?: Partial<BoardMinutesData>;
  companyId?: string; // When set, restrict to this specific company
  prefillFromDividend?: PrefillFromDividend; // Pre-fill data from dividend voucher
}

export const BoardMinutesFormComponent: React.FC<BoardMinutesFormProps> = ({ initialData, companyId, prefillFromDividend }) => {
  const [previewData, setPreviewData] = useState<BoardMinutesData | null>(null);
  const [directorsInput, setDirectorsInput] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companyId || prefillFromDividend?.companyId || '');
  const [isSaving, setIsSaving] = useState(false);
  const [linkedDividendId, setLinkedDividendId] = useState<string | null>(prefillFromDividend?.linkedDividendId || null);
  const [chairmanSignatureName, setChairmanSignatureName] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const { data: usage } = useMonthlyUsage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logActivity = useLogActivity();
  const navigate = useNavigate();

  const getPlanLimits = (plan: string, userType?: string) => {
    // Accountants should have unlimited access regardless of their subscription plan
    if (userType === 'accountant') {
      return { minutes: Infinity };
    }
    
    switch (plan) {
      case 'professional':
        return { minutes: 10 };
      case 'enterprise':
        return { minutes: Infinity } as const;
      default:
        return { minutes: 2 };
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

  // Fetch officers/directors for the selected company
  const { data: officers } = useQuery({
    queryKey: ['officers', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('officers')
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
  } = useForm<BoardMinutesFormData>({
    resolver: zodResolver(boardMinutesSchema),
    defaultValues: initialData as Partial<BoardMinutesFormData>,
  });

  // Auto-fill form when company data is loaded
  useEffect(() => {
    if (companyData) {
      setValue('companyName', companyData.name || '');
    }
  }, [companyData, setValue]);

  // Auto-fill directors when officers are loaded
  useEffect(() => {
    if (officers && officers.length > 0) {
      const directorNames = officers.map(officer => 
        `${officer.title} ${officer.forenames} ${officer.surname}`.trim()
      ).join('\n');
      setDirectorsInput(directorNames);
    }
  }, [officers]);

  // Pre-fill from dividend voucher data
  useEffect(() => {
    if (prefillFromDividend) {
      setValue('companyName', prefillFromDividend.companyName);
      setValue('boardDate', prefillFromDividend.boardDate);
      setValue('paymentDate', prefillFromDividend.paymentDate);
      setValue('dividendPerShare', prefillFromDividend.dividendPerShare);
      setValue('totalDividend', prefillFromDividend.totalDividend);
      setValue('templateStyle', prefillFromDividend.templateStyle as any);
      setLinkedDividendId(prefillFromDividend.linkedDividendId);
    }
  }, [prefillFromDividend, setValue]);

  const templateStyle = watch('templateStyle') || 'classic';

  // Generate preview (temporary, doesn't count against limits)
  const handleGeneratePreview = (data: BoardMinutesFormData) => {
    const directors = directorsInput.split('\n').filter(d => d.trim());
    if (directors.length === 0) {
      alert('Please enter at least one director name');
      return;
    }
    
    setPreviewData({ 
      ...data, 
      directorsPresent: directors,
      logoUrl: profile?.logo_url || undefined,
      accountantFirmName: profile?.user_type === 'accountant' ? profile?.full_name : undefined,
      // Electronic signature fields
      chairmanSignatureName: chairmanSignatureName || undefined,
      signatureDate: signatureDate || data.boardDate || undefined,
    } as BoardMinutesData);
  };


  // Save & Generate (final version, counts against limits)
  const handleSaveAndGenerate = async () => {
    if (!previewData || isSaving) return;

    setIsSaving(true);
    try {
      const plan = usage?.plan || 'trial';
      const limits = getPlanLimits(plan, profile?.user_type);

      // Always re-check usage with fresh counts to prevent stale cache allowing overage
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

      // Check current usage (skip for accountants)
      if (profile?.user_type !== 'accountant') {
        const { count: freshMinutesCount, error: minutesCountError } = await supabase
          .from('minutes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', periodStart.toISOString())
          .lt('created_at', periodEnd.toISOString());
        if (minutesCountError) throw minutesCountError;

        const current = freshMinutesCount || 0;
        if (limits.minutes !== Infinity && current >= limits.minutes) {
          toast({
            variant: 'destructive',
            title: 'Monthly limit reached',
            description: `You have reached your monthly board minutes limit (${limits.minutes}). Upgrade to create more.`,
          });
          return;
        }
      }

      if (!selectedCompanyId) {
        toast({ variant: 'destructive', title: 'Select a company', description: 'Please select a company first.' });
        return;
      }

      // Generate PDF
      const blob = await generateBoardMinutesPDF(previewData);
      
      // Create filename in format: Company Name - Board Minutes - DD/MM/YYYY
      const boardDate = new Date(previewData.boardDate);
      const formattedDate = boardDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      const sanitizedCompanyName = previewData.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
      const filename = `${sanitizedCompanyName} - Board Minutes - ${formattedDate}.pdf`;

      // Upload to storage with user ID folder prefix and timestamp to avoid conflicts
      const timestampedFilename = `board-minutes-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dividend_vouchers')
        .upload(`${user.id}/minutes/${timestampedFilename}`, blob, { contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;

      // Save minutes record for history and counting
      const attendees = previewData.directorsPresent || [];
      const resolutions = [
        `Declared dividend per share: £${previewData.dividendPerShare}`,
        `Total dividend: £${previewData.totalDividend}`,
        `Payment date: ${previewData.paymentDate}`,
      ];

      const { data: insertData, error: insertError } = await supabase.from('minutes').insert({
        user_id: user.id,
        company_id: selectedCompanyId,
        meeting_date: previewData.boardDate,
        meeting_type: 'Board Meeting',
        attendees,
        resolutions,
        file_path: uploadData.path,
        linked_dividend_id: linkedDividendId,
      }).select('id').single();
      if (insertError) throw insertError;

      const newMinutesId = insertData?.id;

      // Update the dividend record with the linked minutes ID
      if (linkedDividendId && newMinutesId) {
        await supabase
          .from('dividend_records')
          .update({ linked_minutes_id: newMinutesId })
          .eq('id', linkedDividendId);
      }

      // Increment the monthly minutes counter using existing RPC function
      const { error: profileError } = await supabase.rpc('increment_monthly_minutes', { 
        user_id_param: user.id 
      });

      if (profileError) {
        console.error('Failed to increment monthly minutes:', profileError);
        // Don't throw error here as the main record was created successfully
      }

      // Log activity
      logActivity.mutate({
        action: 'board_minutes_created',
        description: `Created board minutes for meeting on ${previewData.boardDate}`,
        companyId: selectedCompanyId,
        metadata: {
          meetingDate: previewData.boardDate,
          dividendPerShare: previewData.dividendPerShare,
          totalDividend: previewData.totalDividend,
          directorsCount: previewData.directorsPresent.length,
          linkedDividendId: linkedDividendId,
        }
      });

      // Refresh usage and activity
      queryClient.invalidateQueries({ queryKey: ['monthly-usage'] });
      queryClient.invalidateQueries({ queryKey: ['activity-log'] });

      downloadPDF(blob, filename);
      toast({ title: 'Saved & Generated', description: 'Board minutes saved to history and downloaded.' });
      
      // Navigate back to the appropriate dashboard with the company selected
      const dashboardPath = profile?.user_type === 'accountant' 
        ? `/accountant-dashboard?company=${selectedCompanyId}`
        : `/company-dashboard?company=${selectedCompanyId}`;
      navigate(dashboardPath);
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
        <h2 className="text-xl font-semibold mb-4">Board Minutes Generator</h2>
        
        {/* Pre-fill indicator */}
        {prefillFromDividend && (
          <Alert className="mb-4 border-primary/20 bg-primary/5">
            <Link className="h-4 w-4" />
            <AlertDescription>
              Pre-filled from dividend voucher for {prefillFromDividend.shareholderName}. You can edit the meeting date and other details before saving.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 mb-6">
          <Label className="mb-2">Select Company</Label>
          <CompanySelector
            onSelect={setSelectedCompanyId}
            selectedCompanyId={selectedCompanyId}
            restrictToCompany={companyId || prefillFromDividend?.companyId}
          />
          {selectedCompanyId && companyData && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              ✓ Company data auto-filled from: {companyData.name}
              {officers && officers.length > 0 && (
                <span className="block">✓ {officers.length} director(s) auto-filled</span>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit(handleGeneratePreview)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName" className="text-left block mb-2">Company Name</Label>
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
              <Label htmlFor="boardDate" className="text-left block mb-2">Board Meeting Date</Label>
              <Input
                id="boardDate"
                type="date"
                {...register('boardDate')}
              />
              {errors.boardDate && (
                <p className="text-sm text-red-600 mt-1">{errors.boardDate.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="directorsPresent" className="text-left block mb-2">Directors Present (one per line)</Label>
              <Textarea
                id="directorsPresent"
                value={directorsInput}
                onChange={(e) => setDirectorsInput(e.target.value)}
                placeholder="Enter director names, one per line"
                rows={4}
              />
              {directorsInput.split('\n').filter(d => d.trim()).length === 0 && (
                <p className="text-sm text-red-600 mt-1">At least one director must be present</p>
              )}
            </div>

            <div>
              <Label htmlFor="dividendPerShare" className="text-left block mb-2">
                Dividend per Share (£)
                <HelpTooltip content="The amount paid per share. Calculate by dividing total dividend by number of shares in that class. All shares of the same class must receive the same rate." />
              </Label>
              <Input
                id="dividendPerShare"
                type="number"
                step="0.0001"
                {...register('dividendPerShare', { valueAsNumber: true })}
                placeholder="Enter dividend per share"
              />
              {errors.dividendPerShare && (
                <p className="text-sm text-red-600 mt-1">{errors.dividendPerShare.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="totalDividend" className="text-left block mb-2">
                Total Dividend (£)
                <HelpTooltip content="The total amount being distributed as dividends across all shareholders. This must not exceed the company's available distributable reserves (retained profits)." />
              </Label>
              <Input
                id="totalDividend"
                type="number"
                step="0.01"
                {...register('totalDividend', { valueAsNumber: true })}
                placeholder="Enter total dividend"
              />
              {errors.totalDividend && (
                <p className="text-sm text-red-600 mt-1">{errors.totalDividend.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="paymentDate" className="text-left block mb-2">
                Payment Date
                <HelpTooltip content="The date the dividend will be paid to shareholders. Board minutes must be dated on or before this date. This is when the dividend becomes taxable." />
              </Label>
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
              <Label htmlFor="templateStyle" className="text-left block mb-2">Template Style</Label>
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

          {/* Electronic Signature Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              Electronic Signature
              <HelpTooltip content="Enter the chairman's name to add an electronic signature to the document. The name will appear in an elegant handwriting style on the PDF, eliminating the need for a wet signature." />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chairmanSignatureName" className="text-left block mb-2">
                  Chairman Name (for signature)
                </Label>
                <Input
                  id="chairmanSignatureName"
                  value={chairmanSignatureName}
                  onChange={(e) => setChairmanSignatureName(e.target.value)}
                  placeholder="e.g. John Smith"
                />
                {chairmanSignatureName && (
                  <p className="text-sm text-muted-foreground mt-1 italic" style={{ fontFamily: 'cursive' }}>
                    Preview: {chairmanSignatureName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="signatureDate" className="text-left block mb-2">
                  Signature Date
                </Label>
                <Input
                  id="signatureDate"
                  type="date"
                  value={signatureDate}
                  onChange={(e) => setSignatureDate(e.target.value)}
                />
              </div>
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
          documentType="board-minutes"
          filename={(() => {
            const boardDate = new Date(previewData.boardDate);
            const formattedDate = boardDate.toLocaleDateString('en-GB');
            const sanitizedCompanyName = previewData.companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
            return `${sanitizedCompanyName} - Board Minutes - ${formattedDate}.pdf`;
          })()}
        />
      )}
    </div>
  );
};