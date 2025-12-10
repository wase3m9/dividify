import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FileText, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface DividendDataForMinutes {
  companyId: string;
  companyName: string;
  dividendRecordId: string;
  paymentDate: string;
  totalDividend: number;
  dividendPerShare: number;
  shareholderName: string;
  yearEndDate: string;
  templateStyle: string;
  shareholdersAsAtDate?: string;
}

interface BoardMinutesPromptProps {
  dividendData: DividendDataForMinutes;
  onSkip: () => void;
  onCreateMinutes: () => void;
}

export const BoardMinutesPrompt: React.FC<BoardMinutesPromptProps> = ({
  dividendData,
  onSkip,
  onCreateMinutes,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const navigate = useNavigate();

  // Check for existing minutes on this payment date for this company
  const { data: existingMinutes, isLoading } = useQuery({
    queryKey: ['existing-minutes', dividendData.companyId, dividendData.paymentDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('minutes')
        .select('id, meeting_date, file_path')
        .eq('company_id', dividendData.companyId)
        .eq('meeting_date', dividendData.paymentDate);
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleDontShowAgainChange = async (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ board_minutes_preference: 'dont_prompt' })
          .eq('id', user.id);
      }
    }
  };

  const handleGenerateMinutes = () => {
    // Navigate to board minutes form with pre-fill data
    navigate(`/board-minutes-form?companyId=${dividendData.companyId}`, {
      state: {
        prefillFromDividend: {
          linkedDividendId: dividendData.dividendRecordId,
          companyId: dividendData.companyId,
          companyName: dividendData.companyName,
          paymentDate: dividendData.paymentDate,
          totalDividend: dividendData.totalDividend,
          dividendPerShare: dividendData.dividendPerShare,
          shareholderName: dividendData.shareholderName,
          yearEndDate: dividendData.yearEndDate,
          templateStyle: dividendData.templateStyle,
          boardDate: dividendData.paymentDate, // Default meeting date to payment date
        }
      }
    });
    onCreateMinutes();
  };

  const handleViewExistingMinutes = async (minutesId: string) => {
    // Get the file path and download
    const { data: minutes } = await supabase
      .from('minutes')
      .select('file_path')
      .eq('id', minutesId)
      .single();

    if (minutes?.file_path) {
      const { data } = await supabase.storage
        .from('dividend_vouchers')
        .createSignedUrl(minutes.file_path, 300);
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    }
  };

  if (isLoading) {
    return null;
  }

  // Show duplicate warning if minutes already exist
  if (existingMinutes && existingMinutes.length > 0) {
    return (
      <Card className="p-6 border-amber-200 bg-amber-50">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-full">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800 mb-1">
              Board minutes already exist for this date
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              Board minutes were already created for {dividendData.companyName} on {new Date(dividendData.paymentDate).toLocaleDateString('en-GB')}.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewExistingMinutes(existingMinutes[0].id)}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Minutes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateMinutes}
                className="text-amber-700 hover:bg-amber-100"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Another
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-primary/20 bg-primary/5">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            Create matching board minutes?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            We'll use the same dates and details you've just entered. You can edit the meeting date and wording before saving.
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button onClick={handleGenerateMinutes}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Board Minutes
            </Button>
            <Button variant="ghost" onClick={onSkip}>
              Not now
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShowAgain"
              checked={dontShowAgain}
              onCheckedChange={handleDontShowAgainChange}
            />
            <Label
              htmlFor="dontShowAgain"
              className="text-xs text-muted-foreground cursor-pointer"
            >
              Don't show this again
            </Label>
          </div>
        </div>
      </div>
    </Card>
  );
};
