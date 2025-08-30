import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';

interface UsageLimits {
  dividends: number;
  minutes: number;
  isUnlimited: boolean;
}

interface DocumentGenerationResult {
  success: boolean;
  filePath?: string;
  recordId?: string;
  error?: string;
}

export const useDocumentGeneration = () => {
  const user = useUser();
  const { toast } = useToast();
  const { subscriptionData } = useSubscriptionStatus();
  const [isGenerating, setIsGenerating] = useState(false);

  const getPlanLimits = (plan: string): UsageLimits => {
    switch (plan?.toLowerCase()) {
      case 'trial':
      case 'starter':
        return { dividends: 2, minutes: 2, isUnlimited: false };
      case 'professional':
        return { dividends: 10, minutes: 10, isUnlimited: false };
      case 'enterprise':
      case 'accountant':
        return { dividends: 0, minutes: 0, isUnlimited: true };
      default:
        return { dividends: 2, minutes: 2, isUnlimited: false };
    }
  };

  const checkUsageLimits = async (documentType: 'dividend' | 'minutes'): Promise<boolean> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_month_dividends, current_month_minutes, subscription_plan')
        .eq('id', user?.id)
        .single();

      if (!profile) return false;

      const currentPlan = subscriptionData?.subscription_tier || profile.subscription_plan;
      const limits = getPlanLimits(currentPlan);

      if (limits.isUnlimited) return true;

      const currentUsage = documentType === 'dividend' 
        ? profile.current_month_dividends || 0
        : profile.current_month_minutes || 0;

      const limit = documentType === 'dividend' ? limits.dividends : limits.minutes;

      return currentUsage < limit;
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return false;
    }
  };

  const generateAndSaveDividendVoucher = async (
    formData: any,
    pdfBlob: Blob
  ): Promise<DocumentGenerationResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check usage limits first
    const canGenerate = await checkUsageLimits('dividend');
    if (!canGenerate) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your monthly dividend limit. Upgrade your plan to continue.",
        variant: "destructive"
      });
      return { success: false, error: 'Usage limit reached' };
    }

    setIsGenerating(true);
    
    try {
      // Generate file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${user.id}/${timestamp}-dividend-voucher-${formData.shareholderName.replace(/\s+/g, '-')}.pdf`;

      // Upload PDF to storage
      const { error: uploadError } = await supabase.storage
        .from('dividend_vouchers')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save record to database
      const { data: record, error: dbError } = await supabase
        .from('dividend_records')
        .insert({
          user_id: user.id,
          company_id: formData.companyId,
          shareholder_name: formData.shareholderName,
          share_class: formData.shareClass,
          number_of_shares: parseInt(formData.numberOfShares),
          dividend_per_share: parseFloat(formData.dividendPerShare),
          total_dividend: parseFloat(formData.totalDividend),
          payment_date: formData.paymentDate,
          tax_year: formData.taxYear,
          form_data: formData,
          file_path: fileName
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Increment usage counter
      await supabase.rpc('increment_monthly_dividends', {
        user_id_param: user.id
      });

      // Log activity
      await supabase.rpc('log_activity', {
        user_id_param: user.id,
        company_id_param: formData.companyId,
        action_param: 'dividend_voucher_generated',
        description_param: `Dividend voucher generated for ${formData.shareholderName} - £${formData.totalDividend}`,
        metadata_param: {
          dividend_amount: formData.totalDividend,
          shareholder: formData.shareholderName,
          file_path: fileName
        }
      });

      toast({
        title: "Success",
        description: "Dividend voucher generated and saved successfully!"
      });

      return { 
        success: true, 
        filePath: fileName,
        recordId: record.id
      };

    } catch (error) {
      console.error('Error generating dividend voucher:', error);
      toast({
        title: "Error",
        description: "Failed to generate and save dividend voucher",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAndSaveBoardMinutes = async (
    formData: any,
    pdfBlob: Blob
  ): Promise<DocumentGenerationResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Check usage limits first
    const canGenerate = await checkUsageLimits('minutes');
    if (!canGenerate) {
      toast({
        title: "Usage Limit Reached",
        description: "You've reached your monthly board minutes limit. Upgrade your plan to continue.",
        variant: "destructive"
      });
      return { success: false, error: 'Usage limit reached' };
    }

    setIsGenerating(true);
    
    try {
      // Generate file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${user.id}/${timestamp}-board-minutes-${formData.meetingType.replace(/\s+/g, '-')}.pdf`;

      // Upload PDF to storage
      const { error: uploadError } = await supabase.storage
        .from('board_minutes')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save record to database
      const { data: record, error: dbError } = await supabase
        .from('minutes')
        .insert({
          user_id: user.id,
          company_id: formData.companyId,
          meeting_type: formData.meetingType,
          meeting_date: formData.meetingDate,
          attendees: formData.attendees || [],
          resolutions: formData.resolutions || [],
          form_data: formData,
          file_path: fileName
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Increment usage counter
      await supabase.rpc('increment_monthly_minutes', {
        user_id_param: user.id
      });

      // Log activity
      await supabase.rpc('log_activity', {
        user_id_param: user.id,
        company_id_param: formData.companyId,
        action_param: 'board_minutes_generated',
        description_param: `${formData.meetingType} board minutes generated for ${formData.meetingDate}`,
        metadata_param: {
          meeting_type: formData.meetingType,
          meeting_date: formData.meetingDate,
          file_path: fileName
        }
      });

      toast({
        title: "Success",
        description: "Board minutes generated and saved successfully!"
      });

      return { 
        success: true, 
        filePath: fileName,
        recordId: record.id
      };

    } catch (error) {
      console.error('Error generating board minutes:', error);
      toast({
        title: "Error",
        description: "Failed to generate and save board minutes",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAndSaveDividendVoucher,
    generateAndSaveBoardMinutes,
    checkUsageLimits,
    isGenerating,
    getPlanLimits
  };
};