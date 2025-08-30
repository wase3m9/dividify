
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { MinuteRecord } from "./types";

export const useMinutes = (companyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: minutes, isLoading } = useQuery({
    queryKey: ['minutes', companyId],
    queryFn: async () => {
      let query = supabase
        .from('minutes')
        .select('*');
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as MinuteRecord[];
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('minutes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['minutes'] });
      // Don't invalidate monthly-usage to prevent reducing usage count when deleting

      toast({
        title: "Success",
        description: "Minutes record deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDownload = async (record: MinuteRecord, format: 'pdf' | 'docx') => {
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
      link.download = `board_minutes_${record.id}.${format}`;
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

  return {
    minutes,
    isLoading,
    handleDelete,
    handleDownload
  };
};
