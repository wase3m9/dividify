import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, FileText, Table2, FileCheck, Loader2, AlertCircle } from "lucide-react";
import { generateBoardPack, downloadBoardPack, GenerationProgress } from "@/utils/boardPackGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { SelectedDividendRecord, SelectedBoardMinutes } from "@/utils/documentGenerator/react-pdf/types/boardPackTypes";

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
  const [selectedDividendId, setSelectedDividendId] = useState<string>("");
  const [selectedMinutesId, setSelectedMinutesId] = useState<string>("");
  const [includeCapTable, setIncludeCapTable] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const { toast } = useToast();

  // Fetch existing dividend records for this company
  const { data: dividendRecords } = useQuery({
    queryKey: ['dividend-records-for-pack', company.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  // Fetch existing board minutes for this company
  const { data: boardMinutes } = useQuery({
    queryKey: ['board-minutes-for-pack', company.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('minutes')
        .select('*')
        .eq('company_id', company.id)
        .eq('user_id', user.id)
        .order('meeting_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  // Group dividend records by payment date for selection
  const groupedDividends = dividendRecords?.reduce((acc, record) => {
    const date = record.payment_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof dividendRecords>) || {};

  const dividendDates = Object.keys(groupedDividends).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const selectedDividends = selectedDividendId ? groupedDividends[selectedDividendId] : [];
  const selectedMinutes = boardMinutes?.find(m => m.id === selectedMinutesId);

  const handleGenerate = async () => {
    if (!yearEndDate) {
      toast({
        variant: "destructive",
        title: "Missing year end date",
        description: "Please enter the year end date",
      });
      return;
    }

    if (!selectedDividendId || selectedDividends.length === 0) {
      toast({
        variant: "destructive",
        title: "No dividend vouchers selected",
        description: "Please select dividend vouchers to include",
      });
      return;
    }

    if (!selectedMinutesId || !selectedMinutes) {
      toast({
        variant: "destructive",
        title: "No board minutes selected",
        description: "Please select board minutes to include",
      });
      return;
    }

    setIsGenerating(true);
    setProgress({ step: "Starting...", current: 0, total: 5 });

    try {
      const dividendRecordsForPack: SelectedDividendRecord[] = selectedDividends.map(d => ({
        id: d.id,
        shareholder_name: d.shareholder_name,
        share_class: d.share_class,
        number_of_shares: d.number_of_shares,
        dividend_per_share: Number(d.dividend_per_share),
        total_dividend: Number(d.total_dividend),
        payment_date: d.payment_date,
        form_data: d.form_data,
      }));

      const minutesForPack: SelectedBoardMinutes = {
        id: selectedMinutes.id,
        meeting_date: selectedMinutes.meeting_date,
        meeting_type: selectedMinutes.meeting_type,
        attendees: selectedMinutes.attendees,
        resolutions: selectedMinutes.resolutions,
        form_data: selectedMinutes.form_data,
      };

      const blob = await generateBoardPack(
        {
          companyId: company.id,
          companyName: company.name,
          companyNumber: company.registration_number || "",
          registeredAddress: company.registered_address || "",
          yearEndDate,
          includeCapTable,
          logoUrl,
          accountantFirmName,
          selectedDividendRecords: dividendRecordsForPack,
          selectedBoardMinutes: minutesForPack,
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
    setSelectedDividendId("");
    setSelectedMinutesId("");
    setIncludeCapTable(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const progressPercentage = progress ? (progress.current / progress.total) * 100 : 0;

  const hasDividends = dividendDates.length > 0;
  const hasMinutes = (boardMinutes?.length || 0) > 0;

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
              <Label>Select Dividend Vouchers</Label>
              {hasDividends ? (
                <Select value={selectedDividendId} onValueChange={setSelectedDividendId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dividend date..." />
                  </SelectTrigger>
                  <SelectContent>
                    {dividendDates.map((date) => {
                      const records = groupedDividends[date];
                      const totalAmount = records.reduce((sum, r) => sum + Number(r.total_dividend), 0);
                      return (
                        <SelectItem key={date} value={date}>
                          {formatDate(date)} - {records.length} voucher(s) - £{totalAmount.toFixed(2)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>No dividend vouchers found. Create some first.</span>
                </div>
              )}
              {selectedDividendId && selectedDividends.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedDividends.length} voucher(s) for: {selectedDividends.map(d => d.shareholder_name).join(', ')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Select Board Minutes</Label>
              {hasMinutes ? (
                <Select value={selectedMinutesId} onValueChange={setSelectedMinutesId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board minutes..." />
                  </SelectTrigger>
                  <SelectContent>
                    {boardMinutes?.map((minutes) => (
                      <SelectItem key={minutes.id} value={minutes.id}>
                        {formatDate(minutes.meeting_date)} - {minutes.meeting_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>No board minutes found. Create some first.</span>
                </div>
              )}
              {selectedMinutes && (
                <p className="text-xs text-muted-foreground">
                  Attendees: {selectedMinutes.attendees.join(', ')}
                </p>
              )}
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
                  <FileText className={`h-4 w-4 ${selectedMinutesId ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span>Board Minutes {selectedMinutes ? `(${formatDate(selectedMinutes.meeting_date)})` : ''}</span>
                </div>
                {includeCapTable && (
                  <div className="flex items-center gap-2">
                    <Table2 className="h-4 w-4 text-green-600" />
                    <span>Cap Table Snapshot</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${selectedDividendId ? 'text-green-600' : 'text-muted-foreground'}`} />
                  <span>
                    Dividend Vouchers {selectedDividends.length > 0 ? `(${selectedDividends.length} voucher${selectedDividends.length > 1 ? 's' : ''})` : ''}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={!yearEndDate || !selectedDividendId || !selectedMinutesId || !hasDividends || !hasMinutes}
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
