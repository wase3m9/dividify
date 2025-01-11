import { FC } from "react";
import { Card } from "@/components/ui/card";
import { BadgePoundSterling, Trash2, Edit, FileText } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF, downloadWord } from "@/utils/documentGenerator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DividendRecord {
  id: string;
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  financial_year_ending: string;
  amount_per_share: number;
  total_amount: number;
  director_name: string;
  created_at: string;
}

export const DividendsSection: FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: dividendRecords, isLoading } = useQuery({
    queryKey: ['dividend-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DividendRecord[];
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dividend_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['dividend-records'] });

      toast({
        title: "Success",
        description: "Dividend record deleted successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDownload = (record: DividendRecord, format: 'pdf' | 'docx') => {
    const data = {
      companyName: "Company Name", // TODO: Add company name from context
      registeredAddress: "Registered Address", // TODO: Add address from context
      registrationNumber: "Registration Number", // TODO: Add reg number from context
      shareholderName: record.shareholder_name,
      shareholderAddress: "", // Added this line with a default empty string
      voucherNumber: parseInt(record.id.slice(0, 8), 16), // Convert first 8 chars of UUID to number
      paymentDate: new Date(record.payment_date).toLocaleDateString(),
      shareClass: record.share_class,
      amountPerShare: record.amount_per_share.toString(),
      totalAmount: record.total_amount.toString(),
      directorName: record.director_name,
      financialYearEnding: new Date(record.financial_year_ending).toLocaleDateString()
    };

    if (format === 'pdf') {
      downloadPDF(data);
    } else {
      downloadWord(data);
    }
  };

  const handleEdit = (record: DividendRecord) => {
    toast({
      title: "Coming Soon",
      description: "Edit functionality will be available soon",
    });
  };

  const canDelete = profile?.subscription_plan !== 'starter' && profile?.subscription_plan !== 'trial';

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BadgePoundSterling className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Dividend Vouchers</h2>
        </div>
      </div>
      {dividendRecords && dividendRecords.length > 0 ? (
        <div className="space-y-4">
          {dividendRecords.map((record) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="text-gray-500">Shareholder:</div>
                  <div>{record.shareholder_name}</div>
                  
                  <div className="text-gray-500">Share Class:</div>
                  <div>{record.share_class}</div>
                  
                  <div className="text-gray-500">Payment Date:</div>
                  <div>{new Date(record.payment_date).toLocaleDateString()}</div>
                  
                  <div className="text-gray-500">Financial Year Ending:</div>
                  <div>{new Date(record.financial_year_ending).toLocaleDateString()}</div>
                  
                  <div className="text-gray-500">Amount per Share:</div>
                  <div>£{record.amount_per_share}</div>
                  
                  <div className="text-gray-500">Total Amount:</div>
                  <div>£{record.total_amount}</div>
                  
                  <div className="text-gray-500">Director:</div>
                  <div>{record.director_name}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(record)}
                    className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload(record, 'pdf')}>
                        Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(record, 'docx')}>
                        Download Word
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No dividend vouchers created yet.</p>
      )}
    </Card>
  );
};