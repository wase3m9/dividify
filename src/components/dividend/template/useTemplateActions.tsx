
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF, downloadWord } from "@/utils/documentGenerator";
import { Packer } from "docx";
import { useLogActivity } from "@/hooks/useActivityLog";
import { useQueryClient } from "@tanstack/react-query";

interface Company {
  id: string;
  name: string;
  registration_number: string;
  registered_address: string;
}

export const useTemplateActions = (company: Company | null, formData: any) => {
  const { toast } = useToast();
  const [recordId, setRecordId] = useState<string | null>(null);
  const logActivity = useLogActivity();
  const queryClient = useQueryClient();

  const createOrUpdateRecord = async (filePath: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      if (!company) throw new Error("Company data not found");

      const paymentDate = formData.paymentDate ? new Date(formData.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const currentYear = new Date().getFullYear();
      const taxYear = `${currentYear}-${currentYear + 1}`;

      if (recordId) {
        const { error: updateError } = await supabase
          .from('dividend_records')
          .update({ file_path: filePath })
          .eq('id', recordId);

        if (updateError) throw updateError;
      } else {
        const { data: newRecord, error: saveError } = await supabase
          .from('dividend_records')
          .insert({
            company_id: company.id,
            user_id: user.id,
            shareholder_name: formData.shareholderName || '',
            share_class: formData.shareClass || '',
            payment_date: paymentDate,
            tax_year: taxYear,
            dividend_per_share: parseFloat(formData.amountPerShare || '0'),
            total_dividend: parseFloat(formData.totalAmount || '0'),
            number_of_shares: parseInt(formData.numberOfShares || '0'),
            file_path: filePath
          })
          .select()
          .single();

        if (saveError) throw saveError;
        setRecordId(newRecord.id);

        // Increment the monthly dividend count for the user
        const { error: profileError } = await supabase.rpc('increment_monthly_dividends', { 
          user_id_param: user.id 
        });

        if (profileError) {
          console.error('Failed to increment monthly dividends:', profileError);
          // Don't throw error here as the main record was created successfully
        }

        // Log activity
        logActivity.mutate({
          action: 'dividend_voucher_created',
          description: `Created dividend voucher for ${formData.shareholderName || 'shareholder'}`,
          companyId: company.id,
          metadata: {
            amount: parseFloat(formData.totalAmount || '0'),
            shareholderName: formData.shareholderName || '',
            shareClass: formData.shareClass || ''
          }
        });

        // Refresh queries
        queryClient.invalidateQueries({ queryKey: ['monthly-usage'] });
        queryClient.invalidateQueries({ queryKey: ['activity-log'] });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const handleDownload = async (templateId: string, format: 'pdf' | 'word') => {
    if (!company) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Company details not found",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not authenticated",
        });
        return;
      }

      // Get user's logo URL
      const { data: profile } = await supabase
        .from('profiles')
        .select('logo_url')
        .eq('id', user.id)
        .single();

      const documentData = {
        companyName: company.name,
        registrationNumber: company.registration_number || '',
        registeredAddress: company.registered_address || '',
        shareholderName: formData.shareholderName || '',
        shareholderAddress: formData.shareholderAddress || '',
        shareClass: formData.shareClass || '',
        paymentDate: formData.paymentDate || new Date().toISOString(),
        amountPerShare: formData.amountPerShare?.toString() || '0',
        totalAmount: formData.totalAmount?.toString() || '0',
        voucherNumber: 1,
        financialYearEnding: formData.financialYearEnd || new Date().toISOString(),
        holdings: formData.shareholdings?.toString() || '',
        logoUrl: profile?.logo_url || undefined,
      };

      let filePath = '';
      const now = new Date();
      const timestamp = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/[/:]/g, '-').replace(',', '').replace(/ /g, '_');
      
      const fileName = `dividend_voucher_${timestamp}.${format}`;

      if (format === 'pdf') {
        const doc = await downloadPDF(documentData);
        const pdfBlob = doc.output('blob');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dividend_vouchers')
          .upload(fileName, pdfBlob, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
      } else {
        const doc = await downloadWord(documentData);
        const blob = await Packer.toBlob(doc);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('dividend_vouchers')
          .upload(fileName, blob, {
            contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            upsert: false
          });

        if (uploadError) throw uploadError;
        filePath = uploadData.path;
      }

      await createOrUpdateRecord(filePath);

      toast({
        title: "Success",
        description: `Dividend voucher downloaded successfully as ${format.toUpperCase()}`,
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to generate ${format.toUpperCase()} document. Please ensure all required fields are filled.`,
      });
    }
  };

  return { handleDownload };
};
