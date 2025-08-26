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
import { BoardMinutesData } from '@/utils/documentGenerator/react-pdf/types';
import { generateBoardMinutesPDF, downloadPDF } from '@/utils/documentGenerator/react-pdf';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage';
import { useQueryClient } from '@tanstack/react-query';

const boardMinutesSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  boardDate: z.string().min(1, 'Board date is required'),
  dividendPerShare: z.number().min(0.0001, 'Dividend per share must be greater than 0'),
  totalDividend: z.number().min(0.01, 'Total dividend must be greater than 0'),
  paymentDate: z.string().min(1, 'Payment date is required'),
  templateStyle: z.enum(['classic', 'modern', 'green']).optional(),
});

type BoardMinutesFormData = Omit<BoardMinutesData, 'directorsPresent'>;

interface BoardMinutesFormProps {
  initialData?: Partial<BoardMinutesData>;
}

export const BoardMinutesFormComponent: React.FC<BoardMinutesFormProps> = ({ initialData }) => {
  const [previewData, setPreviewData] = useState<BoardMinutesData | null>(null);
  const [directorsInput, setDirectorsInput] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const { data: usage } = useMonthlyUsage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'professional':
        return { minutes: 10 };
      case 'enterprise':
        return { minutes: Infinity } as const;
      default:
        return { minutes: 2 };
    }
  };

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

  const templateStyle = watch('templateStyle') || 'classic';

  const onSubmit = (data: BoardMinutesFormData) => {
    const directors = directorsInput.split('\n').filter(d => d.trim());
    if (directors.length === 0) {
      alert('Please enter at least one director name');
      return;
    }
    
    setPreviewData({ 
      ...data, 
      directorsPresent: directors 
    } as BoardMinutesData);
  };

  const handleDownload = async () => {
    if (!previewData) return;

    try {
      const plan = usage?.plan || 'trial';
      const limits = getPlanLimits(plan);
      const current = usage?.minutesCount ?? 0;
      if (limits.minutes !== Infinity && current >= limits.minutes) {
        toast({
          variant: 'destructive',
          title: 'Monthly limit reached',
          description: `You have reached your monthly board minutes limit (${limits.minutes}). Upgrade to create more.`,
        });
        return;
      }

      if (!selectedCompanyId) {
        toast({ variant: 'destructive', title: 'Select a company', description: 'Please select a company first.' });
        return;
      }

      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated' });
        return;
      }

      // Generate PDF
      const blob = await generateBoardMinutesPDF(previewData);
      const filename = `board-minutes-${Date.now()}.pdf`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('dividend_vouchers')
        .upload(`minutes/${filename}`, blob, { contentType: 'application/pdf', upsert: false });
      if (uploadError) throw uploadError;

      // Save minutes record for history and counting
      const attendees = previewData.directorsPresent || [];
      const resolutions = [
        `Declared dividend per share: £${previewData.dividendPerShare}`,
        `Total dividend: £${previewData.totalDividend}`,
        `Payment date: ${previewData.paymentDate}`,
      ];

      const { error: insertError } = await supabase.from('minutes').insert({
        user_id: user.id,
        company_id: selectedCompanyId,
        meeting_date: previewData.boardDate,
        meeting_type: 'Board Meeting',
        attendees,
        resolutions,
        file_path: uploadData.path,
      });
      if (insertError) throw insertError;

      // Refresh usage and activity
      queryClient.invalidateQueries({ queryKey: ['monthly-usage'] });
      queryClient.invalidateQueries({ queryKey: ['recent-activity', selectedCompanyId] });

      downloadPDF(blob, filename);
      toast({ title: 'Saved', description: 'Board minutes saved and downloaded.' });
    } catch (error: any) {
      console.error('Error generating/saving PDF:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to generate document.' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Board Minutes Generator</h2>
        
        <div className="space-y-4 mb-6">
          <Label>Select Company</Label>
          <CompanySelector
            onSelect={setSelectedCompanyId}
            selectedCompanyId={selectedCompanyId}
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
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
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
              <Label htmlFor="boardDate">Board Meeting Date</Label>
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
              <Label htmlFor="directorsPresent">Directors Present (one per line)</Label>
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
              <Label htmlFor="dividendPerShare">Dividend per Share (£)</Label>
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
              <Label htmlFor="totalDividend">Total Dividend (£)</Label>
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
              <Label htmlFor="paymentDate">Payment Date</Label>
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
              <Label htmlFor="templateStyle">Template Style</Label>
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
          documentType="board-minutes"
          filename={`board-minutes-${Date.now()}.pdf`}
        />
      )}
    </div>
  );
};