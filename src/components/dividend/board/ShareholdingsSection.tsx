import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShareholderDetailsForm } from "@/components/dividend/ShareholderDetailsForm";
import { ShareholderDetails } from "@/components/dividend/ShareholderDetailsForm";
import { useToast } from "@/hooks/use-toast";

interface Shareholder {
  id: string;
  shareholder_name: string;
  share_class: string;
  number_of_shares: number;
}

interface ShareholdingsSectionProps {
  shareholdings: Shareholder[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onSubmit: (data: ShareholderDetails, shareholderId?: string) => void;
}

export const ShareholdingsSection: FC<ShareholdingsSectionProps> = ({
  shareholdings,
  isDialogOpen,
  onDialogOpenChange,
  onSubmit
}) => {
  const [selectedShareholder, setSelectedShareholder] = useState<Shareholder | null>(null);
  const { toast } = useToast();
  const MAX_SHAREHOLDERS = 10;

  const handleEdit = (shareholder: Shareholder) => {
    setSelectedShareholder(shareholder);
    onDialogOpenChange(true);
  };

  const handleDialogClose = () => {
    setSelectedShareholder(null);
    onDialogOpenChange(false);
  };

  const handleSubmit = (data: ShareholderDetails) => {
    if (shareholdings.length >= MAX_SHAREHOLDERS && !selectedShareholder) {
      toast({
        variant: "destructive",
        title: "Maximum shareholders reached",
        description: `You can only add up to ${MAX_SHAREHOLDERS} shareholders.`,
      });
      handleDialogClose();
      return;
    }
    onSubmit(data, selectedShareholder?.id);
    setSelectedShareholder(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Shareholders</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="text-[#9b87f5] border-[#9b87f5]"
              disabled={shareholdings.length >= MAX_SHAREHOLDERS}
            >
              Add Shareholder {shareholdings.length >= MAX_SHAREHOLDERS && `(${MAX_SHAREHOLDERS} max)`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {selectedShareholder ? 'Edit Shareholder' : 'Add Shareholder'}
            </DialogTitle>
            <ShareholderDetailsForm 
              onSubmit={handleSubmit}
              onPrevious={handleDialogClose}
              initialData={selectedShareholder ? {
                shareholderName: selectedShareholder.shareholder_name,
                shareClass: selectedShareholder.share_class,
                description: "",
                paymentDate: "",
                financialYearEnding: ""
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>
      {shareholdings.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm text-gray-500 mb-2">
            {shareholdings.length} of {MAX_SHAREHOLDERS} shareholders added
          </div>
          {shareholdings.map((shareholding) => (
            <div key={shareholding.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p><span className="font-medium">Name:</span> {shareholding.shareholder_name}</p>
                <p><span className="font-medium">Share Class:</span> {shareholding.share_class}</p>
                <p><span className="font-medium">Number of Shares:</span> {shareholding.number_of_shares}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(shareholding)}
                className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No shareholders added yet.</p>
      )}
    </Card>
  );
};