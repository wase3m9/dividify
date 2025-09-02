import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/utils/excelExport";

interface AnnualSummaryReportProps {
  companyId?: string;
}

export const AnnualSummaryReport: FC<AnnualSummaryReportProps> = ({ companyId }) => {
  const [selectedDirector, setSelectedDirector] = useState<string>("");
  const [selectedTaxYear, setSelectedTaxYear] = useState<string>("");
  const { toast } = useToast();

  // Fetch directors for the company
  const { data: directors } = useQuery({
    queryKey: ['directors', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: dividendRecords } = useQuery({
    queryKey: ['dividend-records', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .eq('company_id', companyId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // Generate tax years from records
  const taxYears = dividendRecords 
    ? [...new Set(dividendRecords.map(record => record.tax_year))].sort()
    : [];

  const generateReport = () => {
    if (!selectedDirector) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a director",
      });
      return;
    }

    if (!selectedTaxYear) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a tax year",
      });
      return;
    }

    const selectedDirectorData = directors?.find(d => d.id === selectedDirector);
    const directorName = selectedDirectorData?.computed_full_name;

    const filteredRecords = dividendRecords?.filter(
      record => record.shareholder_name === directorName && record.tax_year === selectedTaxYear
    ) || [];

    if (filteredRecords.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: "No dividend records found for the selected director and tax year",
      });
      return;
    }

    // Export to Excel
    const filename = `${directorName?.replace(/\s+/g, '_')}_dividend_summary_${selectedTaxYear}.xlsx`;
    exportToExcel(filteredRecords, filename);

    toast({
      title: "Report Generated",
      description: `Annual summary report for ${directorName} (${selectedTaxYear}) downloaded as Excel file`,
    });
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-[#9b87f5]" />
          Annual Summary Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Director</label>
            <Select value={selectedDirector} onValueChange={setSelectedDirector}>
              <SelectTrigger>
                <SelectValue placeholder="Select director" />
              </SelectTrigger>
              <SelectContent>
                {directors?.map((director) => (
                  <SelectItem key={director.id} value={director.id}>
                    {director.computed_full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tax Year</label>
            <Select value={selectedTaxYear} onValueChange={setSelectedTaxYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax year" />
              </SelectTrigger>
              <SelectContent>
                {taxYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={generateReport}
              disabled={!selectedDirector || !selectedTaxYear}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Generate a comprehensive Excel report of all dividend vouchers for the selected director and tax year for self-assessment purposes.
        </p>
      </CardContent>
    </Card>
  );
};