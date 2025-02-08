
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { DividendRecord } from "./types";

export const useDividends = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: dividendRecords, isLoading } = useQuery({
    queryKey: ['dividend-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DividendRecord[];
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dividend_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['dividend-records'] });

      toast({
        title: "Success",
        description: "Dividend record deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDownload = async (record: DividendRecord) => {
    try {
      if (!record.file_path) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File not found",
        });
        return;
      }

      const { data, error } = await supabase.storage
        .from('dividend_vouchers')
        .download(record.file_path);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dividend_voucher_${record.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
    }
  };

  const canDelete = profile?.subscription_plan !== 'starter' && profile?.subscription_plan !== 'trial';

  return {
    dividendRecords,
    isLoading,
    handleDelete,
    handleDownload,
    canDelete
  };
};
