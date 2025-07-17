import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PDFPreview } from '@/utils/documentGenerator/react-pdf';
import { BoardMinutesData } from '@/utils/documentGenerator/react-pdf/types';
import { generateBoardMinutesPDF, downloadPDF } from '@/utils/documentGenerator/react-pdf';

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BoardMinutesFormData>({
    resolver: zodResolver(boardMinutesSchema),
    defaultValues: initialData as Partial<BoardMinutesFormData>,
  });

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
      const blob = await generateBoardMinutesPDF(previewData);
      const filename = `board-minutes-${Date.now()}.pdf`;
      downloadPDF(blob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Board Minutes Generator</h2>
        
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