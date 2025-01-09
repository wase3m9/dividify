import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShareholderDetailsForm } from "@/components/dividend/ShareholderDetailsForm";

interface Shareholding {
  id: string;
  shareholder_name: string;
  share_class: string;
  number_of_shares: number;
}

interface ShareholdingsSectionProps {
  shareholdings: Shareholding[];
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export const ShareholdingsSection: FC<ShareholdingsSectionProps> = ({
  shareholdings,
  isDialogOpen,
  onDialogOpenChange,
  onSubmit
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Shareholdings</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              className="text-[#9b87f5] border-[#9b87f5]"
            >
              Add Shareholder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ShareholderDetailsForm 
              onSubmit={onSubmit}
              onPrevious={() => onDialogOpenChange(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      {shareholdings.length > 0 ? (
        <div className="space-y-2">
          {shareholdings.map((shareholding) => (
            <div key={shareholding.id} className="p-4 border rounded-lg">
              <p><span className="font-medium">Name:</span> {shareholding.shareholder_name}</p>
              <p><span className="font-medium">Share Class:</span> {shareholding.share_class}</p>
              <p><span className="font-medium">Number of Shares:</span> {shareholding.number_of_shares}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No shareholdings added yet.</p>
      )}
    </Card>
  );
};