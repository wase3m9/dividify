import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";

interface DividendRecord {
  id: string;
  shareholder_name: string;
  payment_date: string;
  tax_year: string;
  total_dividend: number;
  file_path: string | null;
}

interface MinuteRecord {
  id: string;
  meeting_type: string;
  meeting_date: string;
  attendees: string[];
  file_path: string | null;
}

interface EmailClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
  companyEmail?: string | null;
  preSelectedVoucherId?: string;
  preSelectedMinutesId?: string;
}

export const EmailClientDialog = ({
  open,
  onOpenChange,
  companyId,
  companyName,
  companyEmail,
  preSelectedVoucherId,
  preSelectedMinutesId,
}: EmailClientDialogProps) => {
  const { toast } = useToast();
  const [dividends, setDividends] = useState<DividendRecord[]>([]);
  const [minutes, setMinutes] = useState<MinuteRecord[]>([]);
  const [selectedVouchers, setSelectedVouchers] = useState<Set<string>>(new Set());
  const [selectedMinutes, setSelectedMinutes] = useState<Set<string>>(new Set());
  const [toEmail, setToEmail] = useState(companyEmail || "");
  const [ccEmail, setCcEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && companyId) {
      fetchDocuments();
      setToEmail(companyEmail || "");
    }
  }, [open, companyId, companyEmail]);

  useEffect(() => {
    if (preSelectedVoucherId) {
      setSelectedVouchers(new Set([preSelectedVoucherId]));
    }
    if (preSelectedMinutesId) {
      setSelectedMinutes(new Set([preSelectedMinutesId]));
    }
  }, [preSelectedVoucherId, preSelectedMinutesId]);

  useEffect(() => {
    updateSubject();
    updateMessage();
  }, [selectedVouchers, selectedMinutes, companyName]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const [dividendsRes, minutesRes] = await Promise.all([
        supabase
          .from("dividend_records")
          .select("id, shareholder_name, payment_date, tax_year, total_dividend, file_path")
          .eq("company_id", companyId)
          .order("payment_date", { ascending: false })
          .limit(20),
        supabase
          .from("minutes")
          .select("id, meeting_type, meeting_date, attendees, file_path")
          .eq("company_id", companyId)
          .order("meeting_date", { ascending: false })
          .limit(20),
      ]);

      if (dividendsRes.error) throw dividendsRes.error;
      if (minutesRes.error) throw minutesRes.error;

      setDividends(dividendsRes.data || []);
      setMinutes(minutesRes.data || []);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load documents",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubject = () => {
    const voucherCount = selectedVouchers.size;
    const minutesCount = selectedMinutes.size;

    if (voucherCount === 0 && minutesCount === 0) {
      setSubject(`Dividend documents – ${companyName}`);
      return;
    }

    if (voucherCount === 1 && minutesCount === 0) {
      const voucher = dividends.find(d => selectedVouchers.has(d.id));
      if (voucher) {
        const date = new Date(voucher.payment_date).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
        setSubject(`Dividend voucher – ${companyName} – ${date}`);
      }
      return;
    }

    if (voucherCount === 1 && minutesCount > 0) {
      const voucher = dividends.find(d => selectedVouchers.has(d.id));
      if (voucher) {
        const date = new Date(voucher.payment_date).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
        setSubject(`Dividend voucher & board minutes – ${companyName} – ${date}`);
      }
      return;
    }

    if (voucherCount === 0 && minutesCount === 1) {
      const minute = minutes.find(m => selectedMinutes.has(m.id));
      if (minute) {
        const date = new Date(minute.meeting_date).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        });
        setSubject(`Board minutes – ${companyName} – ${date}`);
      }
      return;
    }

    setSubject(`Dividend documents – ${companyName}`);
  };

  const updateMessage = () => {
    setMessage(
      `Hi,

Please find attached your dividend documentation for ${companyName}.

This email was sent automatically from Dividify on behalf of your accountant.
Please do not reply to this message.

Kind regards,
Dividify`
    );
  };

  const toggleVoucher = (id: string) => {
    const newSet = new Set(selectedVouchers);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedVouchers(newSet);
  };

  const toggleMinutes = (id: string) => {
    const newSet = new Set(selectedMinutes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedMinutes(newSet);
  };

  const handleSend = async () => {
    if (!toEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a recipient email address",
      });
      return;
    }

    if (selectedVouchers.size === 0 && selectedMinutes.size === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one document to send",
      });
      return;
    }

    // Check all selected documents have file_path
    const selectedVoucherDocs = dividends.filter(d => selectedVouchers.has(d.id));
    const selectedMinutesDocs = minutes.filter(m => selectedMinutes.has(m.id));

    const missingFiles = [
      ...selectedVoucherDocs.filter(d => !d.file_path),
      ...selectedMinutesDocs.filter(m => !m.file_path),
    ];

    if (missingFiles.length > 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Some selected documents don't have PDF files attached",
      });
      return;
    }

    setIsSending(true);

    try {
      const documents = [
        ...selectedVoucherDocs.map(d => ({
          id: d.id,
          type: "voucher" as const,
          file_path: d.file_path!,
          label: `Dividend Voucher - ${d.shareholder_name} - ${new Date(d.payment_date).toLocaleDateString("en-GB")}`,
        })),
        ...selectedMinutesDocs.map(m => ({
          id: m.id,
          type: "minutes" as const,
          file_path: m.file_path!,
          label: `Board Minutes - ${m.meeting_type} - ${new Date(m.meeting_date).toLocaleDateString("en-GB")}`,
        })),
      ];

      const toEmails = toEmail.split(",").map(e => e.trim()).filter(Boolean);
      const ccEmails = ccEmail ? ccEmail.split(",").map(e => e.trim()).filter(Boolean) : [];

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("send-dividify-email", {
        body: {
          companyId,
          companyName,
          to: toEmails,
          cc: ccEmails.length > 0 ? ccEmails : undefined,
          subject,
          message,
          documents,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send email");
      }

      toast({
        title: "Email sent",
        description: `Successfully sent to ${toEmails.join(", ")}`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send email. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSelectedVouchers(new Set());
    setSelectedMinutes(new Set());
    setToEmail(companyEmail || "");
    setCcEmail("");
  };

  const hasVouchersWithFiles = dividends.some(d => d.file_path);
  const hasMinutesWithFiles = minutes.some(m => m.file_path);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Documents - {companyName}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Document Selection */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Select documents to email
              </h3>

              {/* Dividend Vouchers */}
              {dividends.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Dividend Vouchers</h4>
                  <div className="rounded-md border max-h-48 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Shareholder</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Tax Year</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dividends.map(record => (
                          <TableRow
                            key={record.id}
                            className={!record.file_path ? "opacity-50" : "cursor-pointer hover:bg-muted/50"}
                            onClick={() => record.file_path && toggleVoucher(record.id)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedVouchers.has(record.id)}
                                onCheckedChange={() => toggleVoucher(record.id)}
                                disabled={!record.file_path}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {record.shareholder_name}
                            </TableCell>
                            <TableCell>
                              {new Date(record.payment_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{record.tax_year}</TableCell>
                            <TableCell>£{record.total_dividend}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {!hasVouchersWithFiles && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No vouchers with PDF files available
                    </p>
                  )}
                </div>
              )}

              {/* Board Minutes */}
              {minutes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Board Minutes</h4>
                  <div className="rounded-md border max-h-48 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Meeting Type</TableHead>
                          <TableHead>Meeting Date</TableHead>
                          <TableHead>Attendees</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {minutes.map(record => (
                          <TableRow
                            key={record.id}
                            className={!record.file_path ? "opacity-50" : "cursor-pointer hover:bg-muted/50"}
                            onClick={() => record.file_path && toggleMinutes(record.id)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedMinutes.has(record.id)}
                                onCheckedChange={() => toggleMinutes(record.id)}
                                disabled={!record.file_path}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {record.meeting_type}
                            </TableCell>
                            <TableCell>
                              {new Date(record.meeting_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{record.attendees?.length || 0} attendees</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {!hasMinutesWithFiles && (
                    <p className="text-sm text-muted-foreground mt-1">
                      No minutes with PDF files available
                    </p>
                  )}
                </div>
              )}

              {dividends.length === 0 && minutes.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No documents available to email
                </p>
              )}
            </div>

            {/* Email Details */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Email Details
              </h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    type="email"
                    placeholder="recipient@example.com"
                    value={toEmail}
                    onChange={e => setToEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple emails with commas
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cc">CC (optional)</Label>
                  <Input
                    id="cc"
                    type="email"
                    placeholder="cc@example.com"
                    value={ccEmail}
                    onChange={e => setCcEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              isSending ||
              isLoading ||
              (selectedVouchers.size === 0 && selectedMinutes.size === 0) ||
              !toEmail.trim()
            }
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
