import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { downloadPDF, downloadWord } from "@/utils/documentGenerator";
import { Button } from "@/components/ui/button";

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

  const handleDownload = (record: DividendRecord, format: 'pdf' | 'docx') => {
    const data = {
      companyName: "Company Name", // TODO: Add company name from context
      registeredAddress: "Registered Address", // TODO: Add address from context
      registrationNumber: "Registration Number", // TODO: Add reg number from context
      shareholderName: record.shareholder_name,
      voucherNumber: record.id.slice(0, 8),
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-[#9b87f5]" />
          <h2 className="text-xl font-semibold">Dividend Vouchers</h2>
        </div>
      </div>
      {dividendRecords && dividendRecords.length > 0 ? (
        <div className="space-y-4">
          {dividendRecords.map((record) => (
            <div key={record.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p><span className="font-medium">Shareholder:</span> {record.shareholder_name}</p>
                  <p><span className="font-medium">Share Class:</span> {record.share_class}</p>
                  <p><span className="font-medium">Payment Date:</span> {new Date(record.payment_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Financial Year Ending:</span> {new Date(record.financial_year_ending).toLocaleDateString()}</p>
                  <p><span className="font-medium">Amount per Share:</span> £{record.amount_per_share}</p>
                  <p><span className="font-medium">Total Amount:</span> £{record.total_amount}</p>
                  <p><span className="font-medium">Director:</span> {record.director_name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(record, 'pdf')}
                    className="text-[#9b87f5] border-[#9b87f5]"
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(record, 'docx')}
                    className="text-[#9b87f5] border-[#9b87f5]"
                  >
                    Download Word
                  </Button>
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