import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Layers, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShareClassForm } from "@/components/dividend/board/ShareClassForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareClass {
  id: string;
  share_class: string;
  number_of_shares: number;
  number_of_holders: number;
}

interface ShareClassesSectionProps {
  shareClasses: ShareClass[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onSubmit: (data: { shareClass: string; numberOfShares: string; numberOfHolders: string }, shareClassId?: string) => void;
}

export const ShareClassesSection: FC<ShareClassesSectionProps> = ({
  shareClasses,
  isDialogOpen,
  onDialogOpenChange,
  onSubmit
}) => {
  const [selectedShareClass, setSelectedShareClass] = useState<ShareClass | null>(null);
  const { toast } = useToast();

  const handleEdit = (shareClass: ShareClass) => {
    setSelectedShareClass(shareClass);
    onDialogOpenChange(true);
  };

  const handleDialogClose = () => {
    setSelectedShareClass(null);
    onDialogOpenChange(false);
  };

  const handleDelete = async (shareClassId: string) => {
    try {
      const { error } = await supabase
        .from('shareholders')
        .delete()
        .eq('id', shareClassId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Share class deleted successfully",
      });
      
      // Refresh the page to update the list
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSubmit = (data: { shareClass: string; numberOfShares: string; numberOfHolders: string }) => {
    onSubmit(data, selectedShareClass?.id);
    setSelectedShareClass(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Share Classes</h2>
        </div>
        <Button 
          variant="outline"
          className="text-[#9b87f5] border-[#9b87f5]"
          onClick={() => onDialogOpenChange(true)}
        >
          Add Share Class
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <ShareClassForm 
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
            initialData={selectedShareClass ? {
              shareClass: selectedShareClass.share_class,
              numberOfShares: selectedShareClass.number_of_shares.toString(),
              numberOfHolders: selectedShareClass.number_of_holders.toString()
            } : undefined}
          />
        </DialogContent>
      </Dialog>
      {shareClasses.length > 0 ? (
        <div className="space-y-2">
          {shareClasses.map((shareClass) => (
            <div key={shareClass.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p><span className="font-medium">Share Class:</span> {shareClass.share_class}</p>
                <p><span className="font-medium">Number of Shares:</span> {shareClass.number_of_shares}</p>
                <p><span className="font-medium">Number of Holders:</span> {shareClass.number_of_holders}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(shareClass)}
                  className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(shareClass.id)}
                  className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No share classes added yet.</p>
      )}
    </Card>
  );
};