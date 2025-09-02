import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateDividendVoucherPDF } from "@/utils/documentGenerator/react-pdf/generator";
import { DividendVoucherData } from "@/utils/documentGenerator/react-pdf/types";

interface AnnualSummaryReportProps {
  companyId: string;
}

export const AnnualSummaryReport = ({ companyId }: AnnualSummaryReportProps) => {
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(new Date());
  const [selectedDirector, setSelectedDirector] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: directors } = useQuery({
    queryKey: ['directors', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: company } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const { data: dividendRecords } = useQuery({
    queryKey: ['dividend-records', companyId, selectedDirector, selectedYear?.getFullYear()],
    queryFn: async () => {
      if (!selectedDirector || !selectedYear) return [];
      
      const startDate = `${selectedYear.getFullYear()}-04-06`; // UK tax year starts April 6
      const endDate = `${selectedYear.getFullYear() + 1}-04-05`; // UK tax year ends April 5
      
      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .eq('company_id', companyId)
        .eq('shareholder_name', selectedDirector)
        .gte('payment_date', startDate)
        .lte('payment_date', endDate)
        .order('payment_date');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId && !!selectedDirector && !!selectedYear,
  });

  const generateSummaryReport = async () => {
    if (!selectedDirector || !selectedYear || !dividendRecords || !company) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a director and year to generate the report",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const totalDividends = dividendRecords.reduce((sum, record) => 
        sum + parseFloat(record.total_dividend.toString()), 0
      );

      const directorInfo = directors?.find(d => d.computed_full_name === selectedDirector);

      // Create a summary document data using the correct DividendVoucherData interface
      const summaryData: DividendVoucherData = {
        companyName: company.name,
        companyAddress: company.registered_address || '',
        companyRegNumber: company.registration_number || '',
        shareholderName: selectedDirector,
        shareholderAddress: directorInfo?.address || '',
        paymentDate: format(new Date(), 'yyyy-MM-dd'),
        shareholdersAsAtDate: format(new Date(), 'yyyy-MM-dd'),
        sharesHeld: dividendRecords.reduce((sum, record) => sum + record.number_of_shares, 0),
        dividendAmount: totalDividends,
        templateStyle: 'classic' as const,
      };

      const blob = await generateDividendVoucherPDF(summaryData);
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${company.name}_Annual_Dividend_Summary_${selectedYear.getFullYear()}-${selectedYear.getFullYear() + 1}_${selectedDirector.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Annual dividend summary generated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate summary report",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const totalDividends = dividendRecords?.reduce((sum, record) => 
    sum + parseFloat(record.total_dividend.toString()), 0
  ) || 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-[#9b87f5]" />
        <h2 className="text-xl font-semibold">Annual Dividend Summary Report</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tax-year">Tax Year</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedYear && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedYear ? `${selectedYear.getFullYear()}/${selectedYear.getFullYear() + 1}` : "Pick a tax year"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedYear}
                  onSelect={setSelectedYear}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2020-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="director">Director/Shareholder</Label>
            <Select value={selectedDirector} onValueChange={setSelectedDirector}>
              <SelectTrigger>
                <SelectValue placeholder="Select director" />
              </SelectTrigger>
              <SelectContent>
                {directors?.map((director) => (
                  <SelectItem key={director.id} value={director.computed_full_name || ''}>
                    {director.computed_full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {dividendRecords && dividendRecords.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Summary for {selectedDirector}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Dividends:</p>
                <p className="font-semibold">£{totalDividends.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Number of Payments:</p>
                <p className="font-semibold">{dividendRecords.length}</p>
              </div>
              <div>
                <p className="text-gray-500">Tax Year:</p>
                <p className="font-semibold">{selectedYear?.getFullYear()}/{selectedYear?.getFullYear() ? selectedYear.getFullYear() + 1 : ''}</p>
              </div>
              <div>
                <p className="text-gray-500">Share Class:</p>
                <p className="font-semibold">{dividendRecords[0]?.share_class || 'Ordinary'}</p>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={generateSummaryReport}
          disabled={!selectedDirector || !selectedYear || !dividendRecords?.length || isGenerating}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Annual Summary Report'}
        </Button>

        {dividendRecords && dividendRecords.length === 0 && selectedDirector && selectedYear && (
          <p className="text-sm text-gray-500 text-center">
            No dividend records found for {selectedDirector} in the {selectedYear.getFullYear()}/{selectedYear.getFullYear() + 1} tax year.
          </p>
        )}
      </div>
    </Card>
  );
};