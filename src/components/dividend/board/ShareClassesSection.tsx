import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShareClassForm } from "@/components/dividend/board/ShareClassForm";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareClass {
  id: string;
  share_class: string;
  number_of_shares: number;
}

interface ShareClassesSectionProps {
  shareClasses: ShareClass[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onSubmit: (data: ShareholderDetails, shareClassId?: string) => void;
}

export const ShareClassesSection: FC<ShareClassesSectionProps> = ({
  shareClasses,
  isDialogOpen,
  onDialogOpenChange,
  onSubmit
}) => {
  const [selectedShareClass, setSelectedShareClass] = useState<ShareClass | null>(null);
  const { toast } = useToast();
  const MAX_SHAREHOLDERS = 10;

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
      
      window.location.reload();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSubmit = (data: ShareholderDetails) => {
    if (shareClasses.length >= MAX_SHAREHOLDERS && !selectedShareClass) {
      toast({
        variant: "destructive",
        title: "Maximum shareholders reached",
        description: `You can only add up to ${MAX_SHAREHOLDERS} shareholders.`,
      });
      handleDialogClose();
      return;
    }
    onSubmit(data, selectedShareClass?.id);
    setSelectedShareClass(null);
  };

  const handleEdit = (shareClass: ShareClass) => {
    setSelectedShareClass(shareClass);
    onDialogOpenChange(true);
  };

  const handleDialogClose = () => {
    setSelectedShareClass(null);
    onDialogOpenChange(false);
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
          disabled={shareClasses.length >= MAX_SHAREHOLDERS}
          onClick={() => onDialogOpenChange(true)}
        >
          Add Share Class {shareClasses.length >= MAX_SHAREHOLDERS && `(${MAX_SHAREHOLDERS} max)`}
        </Button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogTitle>
            {selectedShareClass ? 'Edit Share Class' : 'Add Share Class'}
          </DialogTitle>
          <ShareClassForm 
            onSubmit={handleSubmit}
            onCancel={handleDialogClose}
            initialData={selectedShareClass ? {
              shareClass: selectedShareClass.share_class,
              numberOfShares: selectedShareClass.number_of_shares.toString(),
              numberOfHolders: "1" // Add default value for numberOfHolders
            } : undefined}
          />
        </DialogContent>
      </Dialog>
      {shareClasses.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-500 mb-2">
            {shareClasses.length} of {MAX_SHAREHOLDERS} share classes added
          </div>
          {shareClasses.map((shareClass) => (
            <div key={shareClass.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-gray-500">Share Class:</div>
                  <div>{shareClass.share_class}</div>
                  
                  <div className="text-gray-500">Number of Shares:</div>
                  <div>{shareClass.number_of_shares}</div>
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No share classes added yet.</p>
      )}
    </Card>
  );
};
