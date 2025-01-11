import { FC } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Trash2, Edit } from "lucide-react";
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
  file_path: string;
  created_at: string;
}

export const MinutesSection: FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: minuteRecords, isLoading } = useQuery({
    queryKey: ['minute-records'],
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

      queryClient.invalidateQueries({ queryKey: ['minute-records'] });

      toast({
        title: "Success",
        description: "Board minutes deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDownload = async (filePath: string, format: 'pdf' | 'word') => {
    try {
      if (!filePath) {
        throw new Error("No file path provided");
      }

      const { data, error } = await supabase.storage
        .from('dividend_vouchers')
        .download(filePath);

      if (error) {
        console.error('Download error:', error);
        throw error;
      }

      if (!data) {
        throw new Error("No data received from storage");
      }

      // Create a URL for the downloaded file
      const url = URL.createObjectURL(data);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop() || `minutes.${format}`; 
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });
    } catch (error: any) {
      console.error('Download error details:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download document. Please try again.",
      });
    }
  };

  const handleEdit = (record: MinuteRecord) => {
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon",
    });
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
      {minuteRecords && minuteRecords.length > 0 ? (
        <div className="space-y-4">
          {minuteRecords.map((record) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600"><span className="font-medium">Title:</span> {record.title}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Meeting Date:</span> {new Date(record.meeting_date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600"><span className="font-medium">Created:</span> {new Date(record.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(record)}
                    className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
                      <DropdownMenuItem onClick={() => handleDownload(record.file_path, 'pdf')}>
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(record.file_path, 'word')}>
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
        <p className="text-sm text-gray-500">No board minutes uploaded yet.</p>
      )}
    </Card>
  );
};