import { FC } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MinuteRecord {
  id: string;
  title: string;
  meeting_date: string;
  created_at: string;
  file_path: string;
}

export const MinutesSection: FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: minutes, isLoading } = useQuery({
    queryKey: ['minutes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('minutes')
        .select('*')
        .order('created_at', { ascending: false });

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

      // Create a download link
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Board Minutes</h2>
        </div>
      </div>
      {minutes && minutes.length > 0 ? (
        <div className="space-y-4">
          {minutes.map((record) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-gray-500">Title:</div>
                  <div>{record.title}</div>
                  
                  <div className="text-gray-500">Meeting Date:</div>
                  <div>{new Date(record.meeting_date).toLocaleDateString()}</div>
                  
                  <div className="text-gray-500">Created:</div>
                  <div>{new Date(record.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload(record, 'pdf')}>
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(record, 'docx')}>
                        Download Word
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No board minutes created yet.</p>
      )}
    </Card>
  );
};