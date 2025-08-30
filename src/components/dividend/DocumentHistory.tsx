import { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DividendRecord {
  id: string;
  shareholder_name: string;
  total_dividend: number;
  payment_date: string;
  tax_year: string;
  created_at: string;
  file_path: string | null;
}

interface MinuteRecord {
  id: string;
  meeting_type: string;
  meeting_date: string;
  created_at: string;
  file_path: string | null;
  form_data: any;
}

export const DocumentHistory = () => {
  const user = useUser();
  const { toast } = useToast();
  const [dividendRecords, setDividendRecords] = useState<DividendRecord[]>([]);
  const [minuteRecords, setMinuteRecords] = useState<MinuteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Fetch dividend records with file paths
      const { data: dividends, error: dividendError } = await supabase
        .from('dividend_records')
        .select('*')
        .eq('user_id', user?.id)
        .not('file_path', 'is', null)
        .order('created_at', { ascending: false });

      if (dividendError) throw dividendError;

      // Fetch minute records with file paths
      const { data: minutes, error: minuteError } = await supabase
        .from('minutes')
        .select('*')
        .eq('user_id', user?.id)
        .not('file_path', 'is', null)
        .order('created_at', { ascending: false });

      if (minuteError) throw minuteError;

      setDividendRecords(dividends || []);
      setMinuteRecords(minutes || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch document history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const bucket = filePath.includes('dividend_vouchers') ? 'dividend_vouchers' : 'board_minutes';
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(filePath);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document History</CardTitle>
          <CardDescription>Loading your document history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document History
        </CardTitle>
        <CardDescription>
          View and download your previously generated dividend vouchers and board minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dividends" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dividends">
              Dividends ({dividendRecords.length})
            </TabsTrigger>
            <TabsTrigger value="minutes">
              Minutes ({minuteRecords.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dividends" className="mt-6">
            {dividendRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No dividend vouchers generated yet</p>
                <p className="text-sm">Generated vouchers will appear here for future download</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Tax Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dividendRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(record.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          Dividend Voucher – {record.shareholder_name}
                        </TableCell>
                        <TableCell>
                          £{record.total_dividend.toFixed(2)}
                        </TableCell>
                        <TableCell>{record.tax_year}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(
                              record.file_path!,
                              `Dividend-Voucher-${record.shareholder_name}-${formatDate(record.created_at)}.pdf`
                            )}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="minutes" className="mt-6">
            {minuteRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No board minutes generated yet</p>
                <p className="text-sm">Generated minutes will appear here for future download</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Generated</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Meeting Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {minuteRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(record.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {record.meeting_type} Board Minutes
                        </TableCell>
                        <TableCell>
                          {formatDate(record.meeting_date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(
                              record.file_path!,
                              `Board-Minutes-${record.meeting_type}-${formatDate(record.meeting_date)}.pdf`
                            )}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};