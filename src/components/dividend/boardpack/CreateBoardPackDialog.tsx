import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Package, FileText, Table2, FileCheck, Loader2 } from "lucide-react";
import { generateBoardPack, downloadBoardPack, GenerationProgress } from "@/utils/boardPackGenerator";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  registration_number?: string | null;
  registered_address?: string | null;
}

interface CreateBoardPackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  logoUrl?: string;
  accountantFirmName?: string;
}

export const CreateBoardPackDialog = ({
  open,
  onOpenChange,
  company,
  logoUrl,
  accountantFirmName,
}: CreateBoardPackDialogProps) => {
  const [yearEndDate, setYearEndDate] = useState("");
  const [dividendDate, setDividendDate] = useState("");
  const [boardMinutesDate, setBoardMinutesDate] = useState("");
  const [includeCapTable, setIncludeCapTable] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!yearEndDate || !dividendDate || !boardMinutesDate) {
      toast({
        variant: "destructive",
        title: "Missing dates",
        description: "Please fill in all required dates",
      });
      return;
    }

    setIsGenerating(true);
    setProgress({ step: "Starting...", current: 0, total: 5 });

    try {
      const blob = await generateBoardPack(
        {
          companyId: company.id,
          companyName: company.name,
          companyNumber: company.registration_number || "",
          registeredAddress: company.registered_address || "",
          yearEndDate,
          dividendDate,
          boardMinutesDate,
          includeCapTable,
          logoUrl,
          accountantFirmName,
        },
        setProgress
      );

      downloadBoardPack(blob, company.name, yearEndDate);

      toast({
        title: "Board pack generated",
        description: "Your board pack has been downloaded successfully",
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Failed to generate board pack:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate board pack",
      });
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const resetForm = () => {
    setYearEndDate("");
    setDividendDate("");
    setBoardMinutesDate("");
    setIncludeCapTable(true);
  };

  const progressPercentage = progress ? (progress.current / progress.total) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Create Board Pack
          </DialogTitle>
          <DialogDescription>
            Generate a complete board pack for {company.name}
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {progress?.step}
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="yearEndDate">Year End Date</Label>
              <Input
                id="yearEndDate"
                type="date"
                value={yearEndDate}
                onChange={(e) => setYearEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dividendDate">Dividend Payment Date</Label>
              <Input
                id="dividendDate"
                type="date"
                value={dividendDate}
                onChange={(e) => {
                  setDividendDate(e.target.value);
                  if (!boardMinutesDate) {
                    setBoardMinutesDate(e.target.value);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="boardMinutesDate">Board Minutes Date</Label>
              <Input
                id="boardMinutesDate"
                type="date"
                value={boardMinutesDate}
                onChange={(e) => setBoardMinutesDate(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="includeCapTable"
                checked={includeCapTable}
                onCheckedChange={(checked) => setIncludeCapTable(checked as boolean)}
              />
              <Label htmlFor="includeCapTable" className="cursor-pointer">
                Include cap table snapshot
              </Label>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">Pack Contents:</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span>Cover Page</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span>Board Minutes</span>
                </div>
                {includeCapTable && (
                  <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4 text-green-600" />
                    <span>Cap Table Snapshot</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span>Dividend Vouchers (per shareholder)</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={!yearEndDate || !dividendDate || !boardMinutesDate}
            >
              <Package className="mr-2 h-4 w-4" />
              Generate Board Pack
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
