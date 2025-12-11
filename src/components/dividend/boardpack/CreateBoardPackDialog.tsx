import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, FileText, Table2, FileCheck, Loader2, AlertCircle, Download, Mail } from "lucide-react";
import { generateBoardPack, downloadBoardPack, GenerationProgress, generateMergedBoardPackPDF, blobToBase64 } from "@/utils/boardPackGenerator";
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
  
  // Email state
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [emailCc, setEmailCc] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
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

  // Update email subject when selections change
  const updateEmailDefaults = () => {
    const formattedDate = yearEndDate ? format(parseISO(yearEndDate), 'dd/MM/yyyy') : '';
    setEmailSubject(`Board Pack - ${company.name} - Year End ${formattedDate}`);
    setEmailMessage(`Please find attached the board pack for ${company.name} for the year ending ${formattedDate}.\n\nThis pack contains:\n- Cover Page\n- Board Minutes\n${includeCapTable ? '- Cap Table Snapshot\n' : ''}- Dividend Vouchers\n\nPlease save these files for your records.`);
  };

  const generatePack = async (): Promise<Blob> => {
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
      id: selectedMinutes!.id,
      meeting_date: selectedMinutes!.meeting_date,
      meeting_type: selectedMinutes!.meeting_type,
      attendees: selectedMinutes!.attendees,
      resolutions: selectedMinutes!.resolutions,
      form_data: selectedMinutes!.form_data,
    };

    return await generateBoardPack(
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
  };

  const validateForm = (): boolean => {
    if (!yearEndDate) {
      toast({
        variant: "destructive",
        title: "Missing year end date",
        description: "Please enter the year end date",
      });
      return false;
    }

    if (!selectedDividendId || selectedDividends.length === 0) {
      toast({
        variant: "destructive",
        title: "No dividend vouchers selected",
        description: "Please select dividend vouchers to include",
      });
      return false;
    }

    if (!selectedMinutesId || !selectedMinutes) {
      toast({
        variant: "destructive",
        title: "No board minutes selected",
        description: "Please select board minutes to include",
      });
      return false;
    }

    return true;
  };

  const handleDownload = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setProgress({ step: "Starting...", current: 0, total: 5 });

    try {
      const blob = await generatePack();
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

  const handleShowEmailForm = () => {
    if (!validateForm()) return;
    updateEmailDefaults();
    setShowEmailForm(true);
  };

  const handleSendEmail = async () => {
    if (!emailTo.trim()) {
      toast({
        variant: "destructive",
        title: "Missing recipient",
        description: "Please enter an email address",
      });
      return;
    }

    setIsSending(true);
    setIsGenerating(true);
    setProgress({ step: "Generating PDFs...", current: 0, total: 5 });

    try {
      // Generate individual PDFs
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
        id: selectedMinutes!.id,
        meeting_date: selectedMinutes!.meeting_date,
        meeting_type: selectedMinutes!.meeting_type,
        attendees: selectedMinutes!.attendees,
        resolutions: selectedMinutes!.resolutions,
        form_data: selectedMinutes!.form_data,
      };

      const mergedPdfBlob = await generateMergedBoardPackPDF(
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
      
      // Convert merged PDF to base64
      setProgress({ step: "Preparing attachment...", current: 5, total: 6 });
      const base64 = await blobToBase64(mergedPdfBlob);
      
      // Create filename for the merged PDF
      const safeName = company.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
      let formattedDate = yearEndDate;
      try {
        formattedDate = format(parseISO(yearEndDate), 'yyyy-MM-dd');
      } catch {}
      const filename = `Board-Pack-${safeName}-YE-${formattedDate}.pdf`;

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Send via edge function
      setProgress({ step: "Sending email...", current: 6, total: 6 });
      
      console.log("Sending board pack email with merged PDF:", filename);
      
      const requestBody = {
        companyId: company.id,
        companyName: company.name,
        yearEndDate,
        to: emailTo,
        cc: emailCc || undefined,
        subject: emailSubject,
        message: emailMessage,
        filename,
        base64,
      };
      
      const response = await fetch(
        'https://vkllrotescxmqwogfamo.supabase.co/functions/v1/send-boardpack-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      toast({
        title: "Board pack sent",
        description: `Email sent successfully to ${emailTo}`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Failed to send board pack:", error);
      toast({
        variant: "destructive",
        title: "Send failed",
        description: error.message || "Failed to send board pack email",
      });
    } finally {
      setIsSending(false);
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const resetForm = () => {
    setYearEndDate("");
    setSelectedDividendId("");
    setSelectedMinutesId("");
    setIncludeCapTable(true);
    setShowEmailForm(false);
    setEmailTo("");
    setEmailCc("");
    setEmailSubject("");
    setEmailMessage("");
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
  const canGenerate = yearEndDate && selectedDividendId && selectedMinutesId && hasDividends && hasMinutes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
        ) : showEmailForm ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="emailTo">To *</Label>
              <Input
                id="emailTo"
                type="email"
                placeholder="recipient@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailCc">CC (optional)</Label>
              <Input
                id="emailCc"
                type="email"
                placeholder="cc@example.com"
                value={emailCc}
                onChange={(e) => setEmailCc(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSubject">Subject</Label>
              <Input
                id="emailSubject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailMessage">Message</Label>
              <Textarea
                id="emailMessage"
                rows={5}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowEmailForm(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSendEmail}
                className="flex-1"
                disabled={!emailTo.trim()}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
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

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                className="flex-1"
                disabled={!canGenerate}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                onClick={handleShowEmailForm}
                variant="outline"
                className="flex-1"
                disabled={!canGenerate}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send via Email
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};