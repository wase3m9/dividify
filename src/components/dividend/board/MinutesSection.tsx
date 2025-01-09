import { FC } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Trash2, Upload } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  const handleSubmit = async () => {
    try {
      if (!title || !meetingDate || !file) {
        throw new Error("Please fill in all fields");
      }

      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No authenticated user found");

      const { data: companyData } = await supabase
        .from('companies')
        .select('id')
        .limit(1)
        .single();

      if (!companyData) throw new Error("No company found");

      const filePath = `minutes/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase
        .storage
        .from('minutes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('minutes')
        .insert([{
          title,
          meeting_date: meetingDate,
          file_path: filePath,
          company_id: companyData.id,
          user_id: user.id, // Add the user_id here
        }]);

      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ['minute-records'] });
      setIsDialogOpen(false);
      setTitle("");
      setMeetingDate("");
      setFile(null);

      toast({
        title: "Success",
        description: "Board minutes uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#9b87f5] hover:bg-[#8b77e5]">
              <Upload className="h-4 w-4 mr-2" />
              Upload Minutes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Board Minutes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Date</label>
                <Input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">File</label>
                <Input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <Button 
                className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
                onClick={handleSubmit}
              >
                Upload
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {minuteRecords && minuteRecords.length > 0 ? (
        <div className="space-y-4">
          {minuteRecords.map((record) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p><span className="font-medium">Title:</span> {record.title}</p>
                  <p><span className="font-medium">Meeting Date:</span> {format(new Date(record.meeting_date), 'PPP')}</p>
                  <p><span className="font-medium">Created:</span> {format(new Date(record.created_at), 'PPP')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Implement file download
                    }}
                    className="text-[#9b87f5] border-[#9b87f5]"
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 border-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No board minutes uploaded yet.</p>
      )}
    </Card>
  );
};