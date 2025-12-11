import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SentEmail {
  id: string;
  to_emails: string;
  subject: string;
  related_type: string;
  status: string;
  created_at: string;
}

interface SentEmailsSectionProps {
  companyId: string;
}

export const SentEmailsSection = ({ companyId }: SentEmailsSectionProps) => {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      fetchEmails();
    }
  }, [companyId]);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("sent_emails")
        .select("id, to_emails, subject, related_type, status, created_at")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error("Error fetching sent emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "voucher":
        return "Dividend Voucher";
      case "minutes":
        return "Board Minutes";
      case "mixed":
        return "Multiple Documents";
      default:
        return type;
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading email history...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Email History</h2>
      </div>

      {emails.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Sent</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emails.map(email => (
                <TableRow key={email.id}>
                  <TableCell>
                    {new Date(email.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {email.to_emails}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {email.subject}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getTypeLabel(email.related_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {email.status === "sent" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Failed</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground">No emails have been sent yet.</p>
      )}
    </Card>
  );
};
